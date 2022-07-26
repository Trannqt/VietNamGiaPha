using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Data.Domain.Annotation
{
    [AttributeUsage(AttributeTargets.Class)]
    public class SqlTableInfo : Attribute
    {
    }
}
