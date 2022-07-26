using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class RootBranchSearch
    {
        public int pageSize { get; set; }
        public int pageSkip { get; set; }
        public string txtSearch { get; set; }
        public int provinceId { get; set; }
        public int districtId { get; set; }
        public string txtWard { get; set; }
    }
}
