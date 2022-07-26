using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Action
{
    public class RootPostViewAction
    {
        public long? Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new RootPostGetByIdRepository())
            {
                cmd.Id = Id;
                return cmd.Execute();
            }
        }
    }
}