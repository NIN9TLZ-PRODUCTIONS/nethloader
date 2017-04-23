using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using nethloader.Models;
using nethloader.Utils;

namespace nethloader.Services.Managers
{
    public interface IImageManager
    {
        Task<Image> SaveImageAsync(User owner, IFormFile file);
        Task<bool> RemoveImageAsync(string id);
        Task<bool> RemoveImageWithOwnerCheckAsync(string userId, string id);
        Task<Image> GetImageAsync(string id);
        Task<Image> GetImageWithOwnerAsync(string id);
        IQueryable<Image> GetAllUserImages(string id);
        IQueryable<Image> GetAllUserImagesWithOwner(string id);
    }
}
