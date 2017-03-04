using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Services.Options
{
    public class MailOptions
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string PublicName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
