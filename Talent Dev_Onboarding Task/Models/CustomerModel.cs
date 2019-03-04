using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Talent_Dev_Onboarding_Task.Models
{
    public class CustomerModel
    {
        [Key]
        public int ID { get; set; }

        [DisplayName("Customer Name")]
        [Required(ErrorMessage = "Customer Name is required")]
        [StringLength(20, MinimumLength = 3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Customer Address is required")]
        [StringLength(70)]
        public string Address { get; set; }

        public ICollection<ProductSold> Sales { get; set; }
    }
}