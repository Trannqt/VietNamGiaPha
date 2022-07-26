using Domain;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class LocationListAction
    {
        public List<LocationItem> Execute()
        {
            using (var cmd = new LocationSearchRepository())
            {
                return cmd.Execute();
            }
        }
    }
}