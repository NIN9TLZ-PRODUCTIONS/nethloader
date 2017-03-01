using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace nethloader.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public DateTime RegisterDate { get; set; }
        public Guid APIKey { get; set; }
    }
}
