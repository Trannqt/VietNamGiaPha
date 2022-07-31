using Action;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VietNamGiaPha.Controllers
{
    public class RootPersonController : CommandBaseController
    {
        [HttpPost]
        public ActionResult RootPersonTreeExecuteSearch(RootPersonTreeExecuteSearchAction commandAction)
        {
            var res = commandAction.Execute();
            return JsonExpando(res);
        }

        [HttpPost]
        public ActionResult RootPersonTreeList(RootPersonTreeListAction commandAction)
        {
            var res = commandAction.Execute();
            return JsonExpando(res);
        }

        public ActionResult RootPersonList()
        {
            return View();
        }

        //[HttpPost]
        //public ActionResult getPersonList(RootPersonListAction commandAction)
        //{
        //    var res = commandAction.Execute();
        //    return JsonExpando(res);
        //}

        [HttpPost]
        public ActionResult ApiRootPersonList(RootPersonListAction commandAction)
        {
            var res = commandAction.Execute();
            return JsonExpando(res);
        }
    }
}