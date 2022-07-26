using Business;
using ConnectDatabase;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootPersonTreeListAction
    {
        public RootPersonSearch Item { get; set; }
        public bool isFirstLoad { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootPersonSearchBusiness())
            {
                cmd.Item = Item;
                cmd.isFirstLoad = isFirstLoad;
                return cmd.Execute();
            }
        }
    }
}