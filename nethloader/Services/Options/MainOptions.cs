using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Services.Options
{
    public class MainOptions
    {
        public bool AllowRegister { get; set; }
        public bool AllowSendMails { get; set; }
        public bool RequireEmailComfirm { get; set; }
    }
}
