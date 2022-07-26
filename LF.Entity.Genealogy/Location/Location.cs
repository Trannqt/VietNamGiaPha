using LF.Data.Domain.Annotation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Entity
{
    [SqlTableInfo]
    public class Location
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? DistrictId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string DistrictName { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? ProvinceId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string Note { get; set; }
    }
}
