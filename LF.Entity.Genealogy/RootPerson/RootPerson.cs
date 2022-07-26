using LF.Data.Domain.Annotation;
using System;

namespace LF.Entity
{
    [SqlTableInfo]
    public class RootPerson
    {
        [SqlColumnInfo(SqlType = "bigint", IsMemberOfKey = true)]
        public long? RootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(250)")]
        public string Name { get; set; }

        [SqlColumnInfo(SqlType = "bit")]
        public bool Sex { get; set; }

        [SqlColumnInfo(SqlType = "datetime")]
        public DateTime? DateOfBirth { get; set; }

        [SqlColumnInfo(SqlType = "int")]
        public int Level { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? RootBranchId { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? FatherRootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? MotherRootPersonId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(500)")]
        public string Remark { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? RootBranch01Id { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? RootBranch02Id { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? ProvinceId { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? DistrictId { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(100)")]
        public string Address { get; set; } // Nơi ở

        [SqlColumnInfo(SqlType = "nvarchar(100)")]
        public string NickName { get; set; }

        [SqlColumnInfo(SqlType = "varchar(100)")]
        public string Phone { get; set; }

        [SqlColumnInfo(SqlType = "nvarchar(100)")]
        public string BirthDayAddress { get; set; } // Nơi sinh

        [SqlColumnInfo(SqlType = "bigint")]
        public long? BirthDayProvinceId { get; set; }

        [SqlColumnInfo(SqlType = "bigint")]
        public long? BirthDayDistrictId { get; set; }

        [SqlColumnInfo(SqlType = "int")]
        public int SortOrder { get; set; } // Con thứ

        [SqlColumnInfo(ColumnName = "ImageLink", SqlType = "varchar(100)")]
        public string ImageLink { get; set; }
    }
}