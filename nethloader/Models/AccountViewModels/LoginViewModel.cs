using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace nethloader.Models.AccountViewModels
{
    public class LoginViewModel
    {
        [Required]
        [RegularExpression("^[!-~ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿ]*$", ErrorMessage="Username contains ilegal characters")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
