using ConnectDatabase;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RootPersonTreeExecuteSearchBusiness: Connection
    {
        public long BranchId { get; set; }
        public long PersonId { get; set; }
        public long Level { get; set; }
        public long MaxLevel { get; set; }
        public long SsBranchId { get; set; }
        public List<dynamic> Execute()
        {
            var tmpResult = new List<dynamic>();
            List<dynamic> result = new List<dynamic>();
            if (BranchId != SsBranchId && SsBranchId != 0)
            {
                using (var cmd = new RootPersonGetParametersByIdRepository())
                {
                    cmd.PersonId = PersonId;
                    cmd.SsBranchId = SsBranchId;
                    tmpResult = cmd.Execute();
                }
            }

            long outPersonId = 0, outBranchId = 0, outLevel = 0, outMaxLevel = 0;
            if (tmpResult.Count > 0)
            {
                Int64.TryParse(tmpResult[0]["RootPersonId"] == null ? tmpResult[0]["RootPersonId"] : tmpResult[0]["RootPersonId"].ToString(), out outPersonId);
                Int64.TryParse(tmpResult[0]["RootBranchId"] == null ? tmpResult[0]["RootBranchId"] : tmpResult[0]["RootBranchId"].ToString(), out outBranchId);
                Int64.TryParse(tmpResult[0]["Level"] == null ? tmpResult[0]["Level"] : tmpResult[0]["Level"].ToString(), out outLevel);
                Int64.TryParse(tmpResult[0]["maxLevel"] == null ? tmpResult[0]["maxLevel"] : tmpResult[0]["maxLevel"].ToString(), out outMaxLevel);
            }
            else
            {
                outBranchId = BranchId;
                outPersonId = PersonId;
                outLevel = Level;
                outMaxLevel = MaxLevel;
            }

            using (var cmd = new RootPersonTreeExecuteSearchRepository())
            {
                cmd.BranchId = outBranchId;
                cmd.PersonId = outPersonId;
                cmd.Level = outLevel;
                cmd.MaxLevel = outMaxLevel;
                return cmd.Execute();
            }
        }
    }
}
