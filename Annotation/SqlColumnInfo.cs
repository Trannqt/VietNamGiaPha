using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Data.Domain.Annotation
{
    //[AttributeUsage(AttributeTargets.Class)]
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
    public class SqlColumnInfo: Attribute
    {
        public string SqlType { get; set; }
        public bool IsMemberOfKey { get; set; }
        public string ColumnName { get; set; }
    }
}
