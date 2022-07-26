using Business;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootPersonTreeExecuteSearchAction
    {
        public long BranchId { get; set; }
        public long PersonId { get; set; }
        public long Level { get; set; }
        public long MaxLevel { get; set; }
        public long SsBranchId { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootPersonTreeExecuteSearchBusiness())
            {
                cmd.BranchId = BranchId;
                cmd.PersonId = PersonId;
                cmd.Level = Level;
                cmd.MaxLevel = MaxLevel;
                cmd.SsBranchId = SsBranchId;
                return cmd.Execute();
            }
        }
    }
}