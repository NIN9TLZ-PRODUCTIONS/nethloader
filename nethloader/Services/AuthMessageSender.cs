using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Services
{
    public class AuthMessageSender: IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Task.FromResult(0);
        }
    }
}
