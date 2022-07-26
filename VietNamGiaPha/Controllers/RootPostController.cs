using Action;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VietNamGiaPha.Controllers
{
    public class RootPostController : CommandBaseController
    {
        // GET: RootPost
        public ActionResult RootPostList()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ApiRootPostList(RootPostListAction commandAction)
        {
            var res = commandAction.Execute();
            return JsonExpando(res);
        }
        public ActionResult RootPostView()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ApiRootPostGetById(RootPostViewAction commandAction)
        {
            var res = commandAction.Execute();
            return JsonExpando(res);
        }
    }
}