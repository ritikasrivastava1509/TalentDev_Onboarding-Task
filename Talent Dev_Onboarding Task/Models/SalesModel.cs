using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace Talent_Dev_Onboarding_Task.Models
{
    public class SalesModel
    {
        [Key]
        public int ID { get; set; }

        [Required(ErrorMessage = "Product id is required")]
        public int ProductID{ get; set; }

        [Required(ErrorMessage = "Customer id is required")]
        public int CustomerID { get; set; }

        [Required(ErrorMessage = "Store id is required")]
        public int StoreID { get; set; }

        [Required(ErrorMessage = "Sale date is required")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:MM/dd/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime DateSold { get; set; }

        public Customer Customer { get; set; }
        public Product Product { get; set; }
        public Store Store { get; set; }
        public string ProductName { get; internal set; }
        public string StoreName { get; internal set; }
        public string CustomerName { get; internal set; }
    }
}