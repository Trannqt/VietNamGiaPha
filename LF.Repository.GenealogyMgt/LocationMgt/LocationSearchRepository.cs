using ConnectDatabase;
using Domain;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Repository
{
    public class LocationSearchRepository: Query
    {
        public List<LocationItem> Execute()
        {
            try
            {
                var fileName = "~/assets/document/Location/location.json";
                var absolutePath = HttpContext.Current.Server.MapPath(fileName);
                if (File.Exists(absolutePath))
                {
                    var locationItem = JsonConvert.DeserializeObject<LocationSearch>(File.ReadAllText(absolutePath));
                    var result = locationItem.Data;
                    return result;
                }
                return new List<LocationItem>();
            }
            catch(Exception ex)
            {
                return new List<LocationItem>();
            }
        }
    }
}
