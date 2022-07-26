using LF.Data.Domain.Annotation;
using System;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootPersonRelationMap
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RelationRootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        public DateTime? WeddingDate { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(500)")]
        public string Note { get; set; }
    }
}