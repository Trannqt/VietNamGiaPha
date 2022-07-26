using Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootBranchViewProfileAction
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootBranchViewProfileBusiness())
            {
                cmd.Id = Id;
                cmd.ProfileId = ProfileId;
                return cmd.Execute();
            }
        }
    }
}