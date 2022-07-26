using ReasonExists;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class ReasonExistsListAction
    { 
        public List<ReasonExistsItem> Execute()
        {
            using (var cmd = new ReasonExistsSearchRepository())
            {
                return cmd.Execute();
            }
        }
    }
}