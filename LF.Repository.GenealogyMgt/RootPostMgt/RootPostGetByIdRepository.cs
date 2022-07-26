using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPostGetByIdRepository: Query
    {
        public long? Id { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @"vnsp_RootPost_RootPostGetById   @Id = @Id_";
                cmd.Parameters = new
                {
                    Id_ = Id,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
