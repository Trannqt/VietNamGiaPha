using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPersonTreeExecuteSearchRepository: Query
    {
        public long BranchId { get; set; }
        public long PersonId { get; set; }
        public long Level { get; set; }
        public long MaxLevel { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vngp_RootPerson_RootPersonTreeExecuteSearch @BranchId = @BranchId_,
                                                                        @PersonId = @PersonId_,
                                                                        @Level = @Level_,
                                                                        @MaxLevel = @MaxLevel_";
                cmd.Parameters = new {
                    BranchId_ = BranchId,
                    PersonId_ = PersonId,
                    Level_ = Level,
                    MaxLevel_ = MaxLevel,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
