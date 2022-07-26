using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Respository
{
    public class RootBranchViewProfileThuyToRepository: Query
    {
        public int Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootBranch_RootBranchViewProfileThuyTo   @Id = @Id_";
                cmd.Parameters = new
                {
                    Id_ = Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
