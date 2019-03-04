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
    public class StoresController : Controller
    {
        private MVCEntities db = new MVCEntities();

        // GET: Stores
        public ActionResult Index()
        {
            return View("");
        }

        // Get Store list to display on the landing page
        public JsonResult GetStoreList()
        {

            List<StoreModel> storeModel = db.Stores.Select(x => new StoreModel
            {
                ID = x.ID,
                Name = x.Name,
                Address = x.Address
            }).ToList();
            return Json(storeModel, JsonRequestBehavior.AllowGet);
        }

        // Save data in the product database
        public JsonResult CreateStore(StoreModel storeModel)
        {

            Store store = new Store();
            store.Name = storeModel.Name;
            store.Address = storeModel.Address;
            db.Stores.Add(store);
            db.SaveChanges();
            return Json(storeModel, JsonRequestBehavior.AllowGet);
        }

        // Get Store for editing
        public JsonResult GetStoreRecord(int id)
        {
            var storeModel = db.Stores.Where(x => x.ID == id).Select(y => new StoreModel
            {
                ID = y.ID,
                Name = y.Name,
                Address = y.Address
            }).FirstOrDefault();

            return Json(storeModel, JsonRequestBehavior.AllowGet);
        }

        // Save the edited store in the database
        public JsonResult EditStoreRecord([Bind(Include = "ID,Name,Address")] StoreModel storeModel)
        {
            var Sto = db.Stores.Find(storeModel.ID);
            Sto.Name = storeModel.Name;
            Sto.Address = storeModel.Address;
            db.SaveChanges();
            return Json(storeModel, JsonRequestBehavior.AllowGet);
        }

        // GET: Store/Delete/5
        public JsonResult Delete(StoreModel storeModel)
        {

            var  store = db.Stores.Find(storeModel.ID);
            if (store == null)
            {
                return Json("Not found", JsonRequestBehavior.AllowGet);
            }
            var isExist = store.ProductSolds.Any();
            if (!isExist)
            {
                db.Stores.Remove(store);
                db.SaveChanges();
                isExist = false;

            }
            List<StoreModel> storeModel1 = db.Stores.Select(x => new StoreModel
            {
                ID = x.ID,
                Name = x.Name,
                Address = x.Address

            }).ToList();
            return Json(new { storeModel = storeModel1, isExist = isExist }, JsonRequestBehavior.AllowGet);
        }

        // POST: Store/Delete/5
        public ActionResult DeleteConfirmed([Bind(Include="ID")]StoreModel storeModel)
        {
            Store store = db.Stores.Find(storeModel.ID);
            db.Stores.Remove(store);
            db.SaveChanges();
            return Json(storeModel, JsonRequestBehavior.AllowGet);

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
