using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using nethloader.Models;
using nethloader.Models.AccountViewModels;
using nethloader.Services;
using nethloader.Services.Managers;
using nethloader.Services.Options;

namespace nethloader.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IImageManager _imageManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly string _externalCookieScheme;
        private readonly MainOptions _MainConfig;

        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IImageManager imageManager,
            IOptions<IdentityCookieOptions> identityCookieOptions,
            IOptions<MainOptions> mainOptions,
            IEmailSender emailSender,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _imageManager = imageManager;
            _externalCookieScheme = identityCookieOptions.Value.ExternalCookieAuthenticationScheme;
            _MainConfig = mainOptions.Value;
            _emailSender = emailSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        public IActionResult Index()
        {
            return RedirectToAction("Login");
        }

        //
        // GET: /Account/Login
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            ViewData["AllowRegister"] = _MainConfig.AllowRegister;
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.Authentication.SignOutAsync(_externalCookieScheme);

            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    _logger.LogInformation(1, "User logged in.");
                    return RedirectToLocal(returnUrl);
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning(2, "User account locked out.");
                    return View("Lockout");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Incorrect username or password.");
                    return View(model);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Register
        [HttpGet]
        public IActionResult Register(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            if (!_MainConfig.AllowRegister)
            {
                return RedirectToAction("Login");
            }
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            if (!_MainConfig.AllowRegister)
            {
                return RedirectToAction("Login");
            }
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                var user = new User()
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    RegisterDate = DateTime.Now,
                    ApiKey = GenerateApiKey()
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    if (_MainConfig.RequireEmailComfirm)
                    {
                        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                        var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                        await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                            $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                    }
                    _logger.LogInformation(3, "User created a new account with password.");
                    return RedirectToLocal(returnUrl);
                }
                AddErrors(result);
            }
            return View(model);
        }

        //
        // POST: /Account/Logout
        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(4, "User logged out.");
            return RedirectToAction("Login");
        }

        // GET: /Account/ConfirmEmail
        [HttpGet]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return View("Error");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            return View(result.Succeeded ? "ConfirmEmail" : "Error");
        }

        // GET: /Account/ForgotPassword
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            ViewData["AllowEmail"] = _MainConfig.AllowSendMails;
            return View();
        }
        // POST: /Account/ForgotPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if(_MainConfig.AllowSendMails)
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                    {
                        // Don't reveal that the user does not exist or is not confirmed
                        return View("ForgotPasswordConfirmation");
                    }

                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var callbackUrl = Url.Action(nameof(ResetPassword), "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                    await _emailSender.SendEmailAsync(model.Email, "Reset Password",
                    $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");
                    return View("ForgotPasswordConfirmation");
                }

                // If we got this far, something failed, redisplay form
                return View(model);
            }
            return RedirectToAction("ForgotPassword");
        }
        // GET: /Account/ForgotPasswordConfirmation
        [HttpGet]
        public IActionResult ForgotPasswordConfirmation()
        {
            return View();
        }
        // GET: /Account/ResetPassword
        [HttpGet]
        public IActionResult ResetPassword()
        {
            return View();
        }
        // POST: /Account/ResetPassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPasswordConfirmation()
        {
            return View();
        }
        #region Settings
        //
        // POST: /Account/ChangeUserName
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UserName(string newUsername)
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (newUsername == currentUser.UserName)
                return BadRequest("You are already using this username.");
            currentUser.UserName = newUsername;
            var result = await _userManager.UpdateAsync(currentUser);
            if (result.Succeeded)
                return Ok();
            return BadRequest(result.Errors);
        }
        //
        // POST: /Account/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if(ModelState.IsValid)
            {
                var currentUser = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var result = await _userManager.ChangePasswordAsync(currentUser, model.OldPassword, model.NewPassword);
                if (result.Succeeded)
                    return Ok();
                return BadRequest(result.Errors);
            }
            return BadRequest(ModelState);
        }
        //
        // POST: /Account/RegenApiKey
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegenApiKey()
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            currentUser.ApiKey = GenerateApiKey();
            var result = await _userManager.UpdateAsync(currentUser);
            if (result.Succeeded)
                return Ok(currentUser.ApiKey);
            return BadRequest(result.Errors);
        }
        //
        // POST: /Account/ChangeCustomDomian
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeCustomDomian(string domain)
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (domain == currentUser.CustomDomain)
                return BadRequest("You are already using this domain.");
            currentUser.CustomDomainStatus = (domain == "");
            currentUser.CustomDomain = domain;

            var result = await _userManager.UpdateAsync(currentUser);
            if (result.Succeeded)
                return Ok();
            return BadRequest(result.Errors);
        }
        //
        // POST: /Account/RemoveAllUserImages
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveAllUserImages()
        {
            await _imageManager.RemoveAllUserImages(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok();
        }
        //
        // POST: /Account/RemoveAcount
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveAccount()
        {
            await _imageManager.RemoveAllUserImages(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _userManager.DeleteAsync(await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value));
            if (result.Succeeded)
                return Ok();
            return BadRequest();
        }
        //
        // POST: /Account/RemoveImagesBetweenTwoDates
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveImagesBetweenTwoDates(DateTime start, DateTime end)
        {
            await _imageManager.RemoveAllUserImagesInsideAInterval(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, start, end);
            return Ok();
        }
        #endregion
        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }

        private string GenerateApiKey()
        {
            var key = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(key);
            }
            return Convert.ToBase64String(key);
        }

        #endregion
    }
}