using ConnectDatabase;
using RootPost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPostSearchRepository: Query
    {
        public RootPostSearch Item { get; set; }
        public bool isFirstLoad { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootPost_RootPostSearch   @pageSize = @pageSize_, 
                                                            @pageSkip = @pageSkip_,
                                                            @txtSearch = @txtSearch_, 
                                                            @type = @type_";
                cmd.Parameters = new
                {
                    pageSize_ = Item.pageSize,
                    pageSkip_ = Item.pageSkip,
                    txtSearch_ = Item.txtSearch,
                    type_ = Item.type,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
