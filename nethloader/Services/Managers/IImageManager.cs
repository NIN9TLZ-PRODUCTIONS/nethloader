using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using nethloader.Models;

namespace nethloader.Services.Managers
{
    public interface IImageManager
    {
        Task<Image> SaveImageAsync(User owner, string description, IFormFile file);
        Task<Image> SaveImageAsync(User owner, IFormFile file);
        Task<Image> GetImageAsync(int id);
        Task<Image> GetImageWithOwnerAsync(int id);
        string GetImagePath(Image image);
    }
}
