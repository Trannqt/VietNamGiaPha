using LF.Data.Domain.Annotation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootPost
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootPostId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string Title { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(1000)")]
        public string TextThumbnail { get; set; }

        [SqlColumnInfo(SqlType = "varchar(100)")]
        public string ImageThumbnail { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(MAX)")]
        public string Description { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        public DateTime CreateDate { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? Writer { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? Editor { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        public DateTime WriteDate { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        public DateTime EditDate { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? ViewCount { get; set; }

        [SqlColumnInfo(SqlType = "int")]
        public long? Type { get; set; }
    }   
}
