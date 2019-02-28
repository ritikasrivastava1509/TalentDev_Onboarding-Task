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
    public class ProductsController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: Products
        public ActionResult Index()
        {

            return View("");
        }

        // Get product list to display on the landing page
        public JsonResult GetProductList()
        {

            List<ProductModel> productModel = db.Products.Select(x => new ProductModel
            {
                ID = x.ID,
                Name = x.Name,
                Price = x.Price
            }).ToList();
            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // Save data in the product database
        public JsonResult CreateProduct(ProductModel productModel)
        {

            Product product = new Product();
            product.Name = productModel.Name;
            product.Price = productModel.Price;
            db.Products.Add(product);
            db.SaveChanges();
            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // Get product for editing
        public JsonResult GetProductRecord(int id)
        {
            var productModel = db.Products.Where(x => x.ID == id).Select(y => new ProductModel
            {
                ID = y.ID,
                Name = y.Name,
                Price = y.Price
            }).FirstOrDefault();

            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // Save the edited product in the database
        public JsonResult EditProductRecord([Bind(Include = "ID,Name,Price")] ProductModel productModel)
        {
            var prod = db.Products.Find(productModel.ID);
            prod.Name = productModel.Name;
            prod.Price = productModel.Price;
            db.SaveChanges();
            return Json(productModel, JsonRequestBehavior.AllowGet);
        }

        // GET: Products/Delete/5
        public JsonResult Delete(ProductModel productModel)
        {

            var product = db.Products.Find(productModel.ID);
            if (product == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);
            }
            var isExist = product.ProductSolds.Any();
            if (!isExist)
            {
                db.Products.Remove(product);
                db.SaveChanges();
                isExist = false;
            }
            List<ProductModel> productModel1 = db.Products.Select(x => new ProductModel
            {
                ID = x.ID,
                Name = x.Name,
                Price = x.Price
            }).ToList();
            return Json(new { productModel = productModel1, isExist = isExist }, JsonRequestBehavior.AllowGet);
        }

        // POST: Products/Delete/5
        public JsonResult DeleteConfirmed([Bind(Include = "ID")]ProductModel productModel)
        {
            Product product = db.Products.Find(productModel.ID);
            db.Products.Remove(product);
            db.SaveChanges();
            return Json(productModel, JsonRequestBehavior.AllowGet);
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
