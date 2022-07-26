using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootBranchIndexRepository: Query
    {
        public int Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootBranch_RootBranchIndex @BranchId = @BranchId_";
                cmd.Parameters = new
                {
                    BranchId_ = Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
