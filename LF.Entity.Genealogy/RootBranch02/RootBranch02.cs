using LF.Data.Domain.Annotation;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootBranch02 
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootBranch02Id { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(250)")]
        public string Name { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(500)")]
        public string Note { get; set; }

        [SqlColumnInfo(SqlType = "bit")]
        public bool IsDefault { get; set; }
    }
}