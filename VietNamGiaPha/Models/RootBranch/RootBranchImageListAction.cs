using LF.Domain.Genealogy.RootBranch;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootBranchImageListAction
    {
        public List<RootBranchImageItem> Execute()
        {
            using (var cmd = new RootBranchImageListRepository())
            {
                return cmd.Execute();
            }
        }
    }
}