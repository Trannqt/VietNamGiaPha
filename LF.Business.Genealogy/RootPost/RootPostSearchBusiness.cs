using ConnectDatabase;
using Repository;
using RootPost;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class RootPostSearchBusiness: Connection
    {
        public bool isFirstLoad { get; set; }
        public RootPostSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            if (isFirstLoad)
            {
                using (var cmd = new RootPostSearchAndGetTotalPagesRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
            else
            {
                using (var cmd = new RootPostSearchRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
        }
    }
}
