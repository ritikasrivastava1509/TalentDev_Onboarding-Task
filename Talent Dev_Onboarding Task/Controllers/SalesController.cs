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
    public class SalesController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: ProductSolds
        public ActionResult Index()
        {
            return View();
        }

        // Get: Sales list to display on the landing page
        public JsonResult GetSalesList()
        {

            List<SalesModel> salesModel = db.ProductSolds.Select(x => new SalesModel
            {
                ID = x.ID,
                ProductID = x.ProductID,
                CustomerID = x.CustomerID,
                DateSold = x.DateSold,
                StoreID = x.StoreID,
                ProductName = x.Product.Name,
                CustomerName = x.Customer.Name,
                StoreName = x.Store.Name,


            }).ToList();
            return Json(salesModel, JsonRequestBehavior.AllowGet);

        }
       

        // GET: ProductSolds/Create
        public ActionResult Create()
        {
            ViewBag.CustomerID = new SelectList(db.Customers, "ID", "Name");
            ViewBag.ProductID = new SelectList(db.Products, "ID", "Name");
            ViewBag.StoreID = new SelectList(db.Stores, "ID", "Name");
            return View();
        }

        // POST: ProductSolds/Create
        public JsonResult CreateSales(SalesModel salesModel)
        {

            ProductSold sales = new ProductSold();
            sales.CustomerID = salesModel.CustomerID;
            sales.ProductID = salesModel.ProductID;
            sales.StoreID = salesModel.StoreID;
            sales.DateSold = salesModel.DateSold;
            db.ProductSolds.Add(sales);
            db.SaveChanges();
            return Json(salesModel, JsonRequestBehavior.AllowGet);
        }

        // GET: ProductSolds/Edit/5
        public JsonResult GetEditSaleRecord(int id)
        {
            var salesModel = db.ProductSolds.Where(x => x.ID == id).Select(y => new SalesModel
            {
                DateSold = y.DateSold,
                CustomerID = y.CustomerID,
                StoreID = y.StoreID,
                ProductID = y.ProductID
            }).FirstOrDefault();

            return Json(salesModel, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit([Bind(Include = "ID,ProductID,CustomerID,StoreID,DateSold")] ProductSold productSold)
        {
            if (ModelState.IsValid)
            {
                db.Entry(productSold).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CustomerID = new SelectList(db.Customers, "ID", "Name", productSold.CustomerID);
            ViewBag.ProductID = new SelectList(db.Products, "ID", "Name", productSold.ProductID);
            ViewBag.StoreID = new SelectList(db.Stores, "ID", "Name", productSold.StoreID);
            return View(productSold);
        }


        public JsonResult UpdateSaleRecord([Bind(Include = "ID,ProductID,CustomerID,StoreID,DateSold")] SalesModel saleModel)
        {
            var sales = db.ProductSolds.Find(saleModel.ID);
            sales.DateSold = saleModel.DateSold;
            sales.CustomerID = saleModel.CustomerID;
            sales.StoreID = saleModel.StoreID;
            sales.ProductID = saleModel.ProductID;
            db.SaveChanges();
            return Json(saleModel, JsonRequestBehavior.AllowGet);

        }

        // GET: ProductSolds/Delete/5

        public ActionResult DeleteSalesRecord(int id)
        {

            ProductSold productSold = db.ProductSolds.Find(id);
            if (productSold == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);

            }
            SalesModel salesModel = new SalesModel
            {
                ID = productSold.ID,
                ProductName = productSold.Product.Name,
                StoreName = productSold.Store.Name,
                CustomerName = productSold.Customer.Name,
                DateSold = productSold.DateSold
            };

            return Json(salesModel, JsonRequestBehavior.AllowGet);
        }

        // POST: Products/Delete/5
        public ActionResult DeleteConfirmed(int id)
        {
            ProductSold productSold = db.ProductSolds.Find(id);

            db.ProductSolds.Remove(productSold);
            db.SaveChanges();
            return Json(JsonRequestBehavior.AllowGet);
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