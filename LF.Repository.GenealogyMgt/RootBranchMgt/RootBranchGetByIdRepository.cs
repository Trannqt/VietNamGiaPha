using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootBranchGetByIdRepository : Query
    {
        public int Id { get; set; }
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootBranch_RootBranchGetById    @BranchId = @Id_,
                                                                    @pageSize = @pageSize_,
                                                                    @pageSkip = @pageSkip_";
                cmd.Parameters = new
                {
                    Id_ = Id,
                    pageSkip_ = pageSkip,
                    pageSize_ = pageSize,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
