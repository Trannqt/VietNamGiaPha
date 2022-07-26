using ConnectDatabase;
using Respository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RootBranchViewProfileBusiness: Connection
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public List<dynamic> Execute()
        {
            if (ProfileId == 1)
            {
                using (var cmd = new RootBranchViewProfileThuyToRepository())
                {
                    cmd.Id = Id;
                    return cmd.Execute();
                }
            }
            else if (ProfileId == 2)
            {
                using (var cmd = new RootBranchViewProfilePhaKyRepository())
                {
                    cmd.Id = Id;
                    return cmd.Execute();
                }
            }
            else
            {
                using (var cmd = new RootBranchViewProfileTocUocRepository())
                {
                    cmd.Id = Id;
                    return cmd.Execute();
                }
            }
        }
    }
}
