using LF.Data.Domain.Annotation;
using System;
using System.ComponentModel;
using System.Web.Mvc;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootPersonMemory
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        [DisplayName("Ngày mất")]
        public DateTime? DateOfDeath { get; set; }

        [SqlColumnInfo(SqlType = "varchar(5)")]
        [DisplayName("Ngày mất ÂL")]
        public string LunarDateOfDeath { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(100)")]
        [DisplayName("Mộ phần")]
        public string Gravestone { get; set; }

        [SqlColumnInfo(SqlType = "ntext")]
        [DisplayName("Tưởng nhớ")]
        [AllowHtml]
        public string MemoryNote { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(4000)")]
        public string PureMemoryNote { get; set; }

        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? MerchantId { get; set; }
    }
}