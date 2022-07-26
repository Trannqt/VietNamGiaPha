using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    [Serializable]
    public class LocationSearch
    {
        public List<LocationItem> Data { get; set; }
    }

    public class LocationItem
    {
        public int DistrictId { get; set; }
        public int ProvinceId { get; set; }
        public string Name { get; set; }
    }
}
