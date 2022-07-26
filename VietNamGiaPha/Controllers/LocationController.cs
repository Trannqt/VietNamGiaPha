using Action;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VietNamGiaPha.Controllers
{
    public class LocationController : CommandBaseController
    {
        // GET: Location
        public ActionResult LocationListSearch(LocationListAction CommandAction)
        {
            return JsonExpando(CommandAction.Execute());
        }
    }
}