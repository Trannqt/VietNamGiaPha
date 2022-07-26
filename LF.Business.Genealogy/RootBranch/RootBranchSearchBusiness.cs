using ConnectDatabase;
using Domain;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RootBranchSearchBusiness: Connection
    {
        public bool isFirstLoad { get; set; }
        public RootBranchSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            if (isFirstLoad) 
            {
                using (var cmd = new RootBranchSearchAndGetTotalPagesRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
            else
            {
                using (var cmd = new RootBranchSearchRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
        }
    }
}
