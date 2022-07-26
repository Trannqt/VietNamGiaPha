using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Action;

namespace VietNamGiaPha.Controllers
{
    public class ReasonExistsController : CommandBaseController
    {
        // GET: ReasonExists
        public ActionResult ReasonExistsList(ReasonExistsListAction CommandAction)
        {
            this.ViewBag.Result = CommandAction.Execute();
            return View();
        }
    }
}