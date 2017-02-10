using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string guid { get; set; }
        public string Description { get; set; }
        public ImageExtensions Extension { get; set; }
    }
}
