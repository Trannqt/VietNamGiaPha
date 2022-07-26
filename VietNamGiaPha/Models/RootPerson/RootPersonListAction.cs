using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootPersonListAction
    {
        public int branchId { get; set; }
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootPersonListRepository())
            {
                cmd.branchId = branchId;
                cmd.pageSize = pageSize;
                cmd.pageSkip = pageSkip;
                return cmd.Execute();
            }
        }
    }
}