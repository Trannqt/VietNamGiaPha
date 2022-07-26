using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Domain.Genealogy.RootBranch
{
    [Serializable]
    public class RootBranchImage
    {
        public List<RootBranchImageItem> Data { get; set; }
    }

    public class RootBranchImageItem
    { 
        public int RootBranchId { get; set; }
        public string RootBranchName { get; set; }
        public string LinkImage { get; set; }
    }
}
