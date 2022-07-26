using Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootBranchViewAction
    {
        public int Id { get; set; }
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootBranchViewBusiness())
            {
                cmd.Id = Id;
                cmd.pageSize = pageSize;
                cmd.pageSkip = pageSkip;
                return cmd.Execute();
            }
        }
    }
}