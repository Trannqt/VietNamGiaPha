using Business;
using Domain;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootBranchListAction
    {
        public bool isFirstLoad { get; set; }
        public RootBranchSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootBranchSearchBusiness())
            {
                cmd.Item = Item;
                cmd.isFirstLoad = isFirstLoad;
                return cmd.Execute();
            }
        }
    }
}