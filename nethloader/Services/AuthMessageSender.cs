using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using nethloader.Services.Options;

namespace nethloader.Services
{
    public class AuthMessageSender: IEmailSender
    {
        private MailOptions _mailOptions;

        public AuthMessageSender(IOptions<MailOptions> mailOptions)
        {
            _mailOptions = mailOptions.Value;
        }
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_mailOptions.PublicName, _mailOptions.Email));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain") { Text = message };
            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_mailOptions.Host, _mailOptions.Port, false).ConfigureAwait(false);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                await client.AuthenticateAsync(_mailOptions.UserName, _mailOptions.Password);
                await client.SendAsync(emailMessage).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }
    }
}
