using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPersonListRepository: Query
    {
        public int branchId { get; set; }
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_Branch_GetPersonListByBranchId @branchId = @branchId_, @pageSize = @pageSize_, @pageSkip = @pageSkip_";
                cmd.Parameters = new
                {
                    branchId_ = branchId,
                    pageSize_ = pageSize,
                    pageSkip_ = pageSkip,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
