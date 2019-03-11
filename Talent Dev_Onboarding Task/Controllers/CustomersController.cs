using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Talent_Dev_Onboarding_Task.Models;

namespace Talent_Dev_Onboarding_Task.Controllers
{
    public class CustomersController : Controller
    {
        private MVCEntities db = new MVCEntities();
 // GET: Customers
        public ActionResult Index()
        {
            return View("");
        }
 // Get: Customer list to display on the landing page
        public JsonResult GetCustomerList()
        {

            List<CustomerModel> customerModel = db.Customers.Select(x => new CustomerModel
            {
                ID = x.ID,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }
 // Save data in the Customer database
        public JsonResult CreateCustomer(CustomerModel customerModel)
        {

            Customer customer = new Customer();
            customer.Name = customerModel.Name;
            customer.Address = customerModel.Address;
            db.Customers.Add(customer);
            db.SaveChanges();
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }

        // Get  for Customer editing
        public JsonResult GetCustomerRecord(int id)
        {
            var customerModel = db.Customers.Where(x => x.ID == id).Select(y => new CustomerModel
            {
                ID = y.ID,
                Name = y.Name,
                Address = y.Address
            }).FirstOrDefault();

            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }

        // Save the edited Customer in the database
        public JsonResult EditCustomerRecord([Bind(Include = "ID,Name,Address")] CustomerModel customerModel)
        {
            var cust = db.Customers.Find(customerModel.ID);
            cust.Name = customerModel.Name;
            cust.Address = customerModel.Address;
            db.SaveChanges();
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }
        // GET:  Customer/Delete/5
        public JsonResult Delete(CustomerModel customerModel)
        {

            var customer = db.Customers.Find(customerModel.ID);
            if (customer == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);
            }
            var isExist = customer.ProductSolds.Any();
            if (!isExist)
            {
                db.Customers.Remove(customer);
                db.SaveChanges();
                isExist = false;

            }
            List<CustomerModel> customerModel1 = db.Customers.Select(x => new CustomerModel
            {
                ID = x.ID,
                Name = x.Name,
                Address = x.Address
            }).ToList();

            return Json(new { customerModel = customerModel1, isExist = isExist }, JsonRequestBehavior.AllowGet);
        }
        // POST: Customers/Delete/5
        public JsonResult DeleteConfirmed([Bind(Include ="ID")] CustomerModel customerModel)
        {
            Customer customer = db.Customers.Find(customerModel.ID);

            db.Customers.Remove(customer);
            db.SaveChanges();
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }
 protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    
}
}
