using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Models
{
    [Table("Images")]
    public class Image
    {
        [Key, Column(Order = 0)]
        public string Id { get; set; }
        public string Description { get; set; }
        public DateTime UploadDate { get; set; }
        public ImageExtensions Extension { get; set; }
        public virtual User Owner { get; set; }
    }
}
