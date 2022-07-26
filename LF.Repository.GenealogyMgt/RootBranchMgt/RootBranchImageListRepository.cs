using ConnectDatabase;
using LF.Domain.Genealogy.RootBranch;
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
    public class RootBranchImageListRepository:  Query
    {
        public List<RootBranchImageItem> Execute()
        {
            try
            {
                var fileName = "~/assets/document/RootBranch/RootBranchImage.json";
                var absolutePath = HttpContext.Current.Server.MapPath(fileName);
                if (File.Exists(absolutePath))
                {
                    var locationItem = JsonConvert.DeserializeObject<RootBranchImage>(File.ReadAllText(absolutePath));
                    var result = locationItem.Data;
                    return result;
                }
                return new List<RootBranchImageItem>();
            }
            catch (Exception ex)
            {
                return new List<RootBranchImageItem>();
            }
        }
    }
}
