using ConnectDatabase;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPersonTreeListRepository : Query
    {
        public bool isFirstLoad { get; set; }
        public RootPersonSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootPerson_RootPersonTreeList    @pageSize = @pageSize_, 
                                                                        @pageSkip = @pageSkip_,
                                                                        @BranchId = @BranchId_";
                cmd.Parameters = new
                {
                    pageSize_ = Item.pageSize,
                    pageSkip_ = Item.pageSkip,
                    BranchId_ = Item.Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
