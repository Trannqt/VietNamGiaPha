using Business;
using RootPost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootPostListAction
    {
        public RootPostSearch Item { get; set; }
        public bool isFirstLoad { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootPostSearchBusiness())
            {
                cmd.Item = Item;
                cmd.isFirstLoad = isFirstLoad;
                return cmd.Execute();
            }
        }
    }
}