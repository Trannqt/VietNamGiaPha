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
    public class RootPersonTreeListBusiness : Connection
    {
        public bool isFirstLoad { get; set; }
        public RootPersonSearch Item { get; set; }
        public List<dynamic> Execute()
        {
            if (isFirstLoad)
            {
                using (var cmd = new RootPersonTreeListAndGetTotalPagesRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
            else
            {
                using (var cmd = new RootPersonTreeListRepository())
                {
                    cmd.Item = this.Item;
                    return cmd.Execute();
                }
            }
        }
    }
}
