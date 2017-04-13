using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using nethloader.Models;
using nethloader.Services.Managers;

namespace nethloader.Controllers
{
    [Authorize]
    public class ImageController : Controller
    {
        private readonly UserManager<User> _userManager;
        private IImageManager _imageManager;

        public ImageController(UserManager<User> userManager, IImageManager imageManager, IHostingEnvironment env)
        {
            _userManager = userManager;
            _imageManager = imageManager;
        }
        public IActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        [ActionName("View")]
        public async Task<IActionResult> ViewImg(string id)
        {
            var img = await _imageManager.GetImageWithOwnerAsync(id);
            ViewData["ImgUrl"] = _imageManager.GetImagePath(img);
            return View(img);
        }
        [HttpGet]
        public IActionResult Upload()
        {
            return View();
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Upload(IFormFile file)
        {

            var currentUser = await _userManager.FindByIdAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var img = await _imageManager.SaveImageAsync(currentUser, file);
            if(img == null)
            {
                return BadRequest();
            }
            return RedirectToAction("View", new { id = img.Id });
        }
    }
}