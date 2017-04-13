using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using nethloader.Services.Managers;

namespace nethloader.Controllers
{
    public class HomeController : Controller
    {
        private IImageManager _imageManager;
        public HomeController(IImageManager imageManager)
        {
            _imageManager = imageManager;
        }
        [Authorize]
        public async Task<IActionResult> Index(int? page)
        {
            return View(await _imageManager.GetPaginatedUserImagesAsync(User.FindFirst(ClaimTypes.NameIdentifier)?.Value,page ?? 1, 10));
        }
        public IActionResult Error()
        {
            return View();
        }
    }
}