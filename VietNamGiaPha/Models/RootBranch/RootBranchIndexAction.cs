using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootBranchIndexAction
    {
        public int Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootBranchIndexRepository())
            {
                cmd.Id = Id;
                return cmd.Execute();
            }
        }
    }
}