//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Talent_Dev_Onboarding_Task.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ProductSold
    {
        public int ID { get; set; }
        public int ProductID { get; set; }
        public int CustomerID { get; set; }
        public int StoreID { get; set; }
        public System.DateTime DateSold { get; set; }
    
        public virtual Customer Customer { get; set; }
        public virtual Product Product { get; set; }
        public virtual Store Store { get; set; }
    }
}
