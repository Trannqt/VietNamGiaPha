using ConnectDatabase;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RootBranchViewBusiness : Connection
    {
        public int Id { get; set; }
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public List<dynamic> Execute()
        {
            if (pageSize == 0 && pageSkip == 0)
            {
                using (var cmd = new RootBranchGetBranchByIdRepository())
                {
                    cmd.Id = Id;
                    return cmd.Execute();
                }
            }
            else
            {
                List<dynamic> result = new List<dynamic>();
                using (var cmd = new RootBranchGetBranchByIdRepository())
                {
                    cmd.Id = Id;
                    result.Add(cmd.Execute());
                }

                using (var cmd = new RootBranchGetByIdRepository())
                {
                    cmd.Id = Id;
                    cmd.pageSize = pageSize;
                    cmd.pageSkip = pageSkip;
                    result.Add(cmd.Execute());
                }
                return result;
            }
        }
    }
}
