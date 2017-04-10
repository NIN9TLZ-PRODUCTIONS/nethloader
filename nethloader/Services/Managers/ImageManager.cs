using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using nethloader.Data;
using nethloader.Models;

namespace nethloader.Services.Managers
{
    public class ImageManager: IImageManager
    {
        private ApplicationDbContext _db;
        private IHostingEnvironment _env;
        public ImageManager(ApplicationDbContext db, IHostingEnvironment env)
        {
            _db = db;
            _env = env;
        }

        public async Task<Image> GetImageAsync(int id) => await _db.Images.FindAsync(id);

        public async Task<Image> GetImageWithOwnerAsync(int id)
        {
            var img = await _db.Images.FindAsync(id);
            _db.Entry(img).Reference(b => b.Owner).Load();
            return img;
        }

        public string GetImagePath(Image image)
        {
            if (image.Owner.CustomDomainStatus == true)
            {
                return $"{image.Owner.CustomDomain}/{image.Name}.{image.Extension}";
            }
            else
            {
                return $"/raw-img/{image.Owner.Id}/{image.Name}.{image.Extension}";
            }
        }

        public async Task<Image> SaveImageAsync(User owner, string description, IFormFile file)
        {
            try
            {
                var extension = Enum.Parse(typeof(ImageExtensions), Path.GetExtension(file.FileName).Replace(".", ""), true);
                if (file.Length > 0)
                {
                    var img = new Image
                    {
                        Name = Path.GetRandomFileName(),
                        Description = description,
                        Extension = (ImageExtensions)extension,
                        Owner = owner
                    };
                    var path = Path.Combine(new string[4] { _env.WebRootPath, "raw-img", owner.Id, $"{img.Name}.{img.Extension}" });
                    var directory = Path.GetDirectoryName(path);

                    if (!Directory.Exists(directory))
                        Directory.CreateDirectory(directory);

                    using (var fileStream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    await _db.Images.AddAsync(img);
                    await _db.SaveChangesAsync();
                    return img;
                }
                return null;
            } catch
            {
                return null;
            }

        }
                
        public async Task<Image> SaveImageAsync(User owner, IFormFile file) => await SaveImageAsync(owner, "", file);
    }
}
