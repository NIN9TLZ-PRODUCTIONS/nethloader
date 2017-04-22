using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using nethloader.Models;
using nethloader.Services.Managers;
using nethloader.Utils;

namespace nethloader.Controllers
{
    public class HomeController : Controller
    {
        private IImageManager _imageManager;
        private readonly UserManager<User> _userManager;
        public HomeController(UserManager<User> userManager, IImageManager imageManager)
        {
            _userManager = userManager;
            _imageManager = imageManager;
        }
        [Authorize]
        public async Task<IActionResult> Index(int? page)
        {
            var user = await _userManager.GetUserAsync(User);
            var images = await PaginatedList<Image>.CreateAsync(_imageManager.GetAllUserImages(User.FindFirst(ClaimTypes.NameIdentifier).Value).OrderByDescending(x => x.Id), page ?? 1, 16);
            foreach (var img in images)
            {
                img.Owner = user;
                img.Url = ImageManager.GetImagePath(img);
            }
            return View(images);
        }
        public IActionResult Error()
        {
            return View();
        }
    }
}