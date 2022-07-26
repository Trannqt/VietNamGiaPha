using LF.Data.Domain.Annotation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Entity
{
    [SqlTableInfo]
    public class Province
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? ProvinceId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string ProvinceName { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string Note { get; set; }
    }
}
