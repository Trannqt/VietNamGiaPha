using LF.Data.Domain.Annotation;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootBranch 
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootBranchId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(250)")]
        public string Name { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(500)")]
        public string Note { get; set; }

        [SqlColumnInfo(SqlType = "bit")]
        public bool IsDefault { get; set; }

        [SqlColumnInfo(SqlType = "varchar(500)")]
        public string ImageThumbnail { get; set; }
        
        [SqlColumnInfo(SqlType = "bigint")]
        public long? ProvinceId { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? DistrictId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(200)")]
        public string Address { get; set; }
        
        [SqlColumnInfo(SqlType = "nvarchar(2000)")]
        public string Slogan { get; set; }
        
        [SqlColumnInfo(SqlType = "nvarchar(2000)")]
        public string TeXuanHoliday { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(2000)")]
        public string TeThuHoliday { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(2000)")]
        public string HoiMaHoliday { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? AdminRootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(MAX)")]
        public string ContentPhaKy{ get; set; }
        
        [SqlColumnInfo(SqlType = "nvarchar(MAX)")]
        public string ContentTocUoc{ get; set; }
        
        [SqlColumnInfo(SqlType = "nvarchar(MAX)")]
        public string ContentThuyTo{ get; set; }
    }
}