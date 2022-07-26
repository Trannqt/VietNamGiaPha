CREATE PROC [dbo].[vnsp_RootBranch_RootBranchViewGetInfo]
(
	@Id INT
)
AS
BEGIN
    DECLARE @query NVARCHAR(MAX)=''
	SET @query = @query + '
		SELECT	Br.RootBranchId, 
				Br.Name, 
				Br.Note, 
				Br.IsDefault, 
				Br.ImageThumbnail, 
				ISNULL(A.ProvinceName,'''') ProvinceName, 
				ISNULL(B.DistrictName,'''') DistrictName, 
				ISNULL(Br.Address,'''') Address
		FROM RootBranch Br
		JOIN(
				SELECT *
				FROM Province Pr 
			) A ON Br.ProvinceId = A.ProvinceId
		JOIN (
				SELECT * 
				FROM dbo.District D
			) B ON Br.DistrictId = B.DistrictId
		WHERE Br.RootBranchId = ' + CONVERT(VARCHAR(20),@Id)

	EXEC (@query)
END

