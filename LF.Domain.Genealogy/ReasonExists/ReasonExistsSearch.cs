using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReasonExists
{
    [Serializable]
    public class ReasonExistsSearch
    {
        public List<ReasonExistsItem> Data { get; set; }
    }

    public class ReasonExistsItem
    {
        public string Reason { get; set; }
        public string Description { get; set; }
        public string LinkYoutube { get; set; }
        public string ImageThumbnail { get; set; }
    }
}
