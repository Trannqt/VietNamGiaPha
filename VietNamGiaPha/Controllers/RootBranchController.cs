using Action;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VietNamGiaPha.Controllers
{
    public class RootBranchController : CommandBaseController
    {
        // GET: RootBranch
        public ActionResult RootBranchList()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ApiRootBranchList(RootBranchListAction CommandAction)
        {
            return JsonExpando(CommandAction.Execute());
        }
        
        public ActionResult RootBranchView(RootBranchViewAction CommandAction)
        {
            var res = CommandAction.Execute();
            if (res.Count > 0)
            {
                string brachIdTemp = res[0]["RootBranchId"] == null? "": res[0]["RootBranchId"].ToString();
                HttpContext.Session.Remove("flagShow");
                HttpContext.Session.Remove("branchId");

                HttpContext.Session["flagShow"] = "show";
                HttpContext.Session["branchId"] = brachIdTemp;
            }

            return View();
        }

        [HttpPost]
        public ActionResult ApiRootBranchGetById(RootBranchViewAction CommandAction)
        {
            var res = CommandAction.Execute();
            return JsonExpando(res);
        }

        public ActionResult RootBranchViewProfile(RootBranchViewProfileAction CommandAction)
        {
            this.ViewBag.Result = CommandAction.Execute();
            this.ViewBag.ProfileId = CommandAction.ProfileId;
            return View();
        }

        public ActionResult RootBranchImageList(RootBranchImageListAction CommandAction)
        {
            return JsonExpando(CommandAction.Execute());
        }

        public ActionResult RootBranchViewGetInfo(RootBranchViewGetInfo CommandAction)
        {
            return JsonExpando(CommandAction.Execute());
        }
        public ActionResult RootBranchIndex(RootBranchIndexAction commandAction)
        {
            var result = commandAction.Execute();
            return View(result);
        }
    }
}