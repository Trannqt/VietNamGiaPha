using ConnectDatabase;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootBranchSearchRepository:  Query
    {
        public bool isFirstLoad { get; set; }
        public RootBranchSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootBranch_RootBranchSearch   @pageSize = @pageSize_, 
                                                                @pageSkip = @pageSkip_,
                                                                @txtSearch = @txtSearch_, 
                                                                @provinceId = @provinceId_, 
                                                                @districtId = @districtId_, 
                                                                @txtWard = @txtWard_";
                cmd.Parameters = new
                {
                    pageSize_ = Item.pageSize,
                    pageSkip_ = Item.pageSkip,
                    txtSearch_ = Item.txtSearch,
                    provinceId_ = Item.provinceId,
                    districtId_ = Item.districtId,
                    txtWard_ = Item.txtWard
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
