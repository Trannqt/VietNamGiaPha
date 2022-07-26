using ConnectDatabase;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPersonSearchAndGetTotalPagesRepository: Query
    {
        public RootPersonSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vngp_RootPerson_RootPersonSearchAndGetTotalPagesByBranchId 
                                    @BranchId = @BranchId_";
                cmd.Parameters = new
                {
                    BranchId_ = Item.Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
