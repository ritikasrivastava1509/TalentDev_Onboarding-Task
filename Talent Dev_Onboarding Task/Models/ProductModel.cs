using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace Talent_Dev_Onboarding_Task.Models
{
    public class ProductModel
    {
        
        
            [Key]
            public int ID { get; set; }

            [DisplayName("Product Name")]
            [Required(ErrorMessage = "Product Name is required")]
            [StringLength(20, MinimumLength = 2)]
            public string Name { get; set; }

            [Required(ErrorMessage = "Price is required")]
            public decimal Price { get; set; }

            public ICollection<ProductSold> Sales { get; set; }
        

    }
}