using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository 
{
    public class RootBranchGetBranchByIdRepository : Query
    {
        public int Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootBranch_RootBranchGetBranchById @Id = @Id_";
                cmd.Parameters = new
                {
                    Id_ = Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
