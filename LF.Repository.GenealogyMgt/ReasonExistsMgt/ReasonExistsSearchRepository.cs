using ConnectDatabase;
using Newtonsoft.Json;
using ReasonExists;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Repository
{
    public class ReasonExistsSearchRepository: Query
    {
        public List<ReasonExistsItem> Execute()
        {
            try
            {
                var fileName = "~/assets/document/ReasonExists/ReasonExists.json";
                var absolutePath = HttpContext.Current.Server.MapPath(fileName);
                if (File.Exists(absolutePath))
                {
                    var locationItem = JsonConvert.DeserializeObject<ReasonExistsSearch>(File.ReadAllText(absolutePath));
                    var result = locationItem.Data;
                    return result;
                }
                return new List<ReasonExistsItem>();
            }
            catch (Exception ex)
            {
                return new List<ReasonExistsItem>();
            }
        }
    }
}
