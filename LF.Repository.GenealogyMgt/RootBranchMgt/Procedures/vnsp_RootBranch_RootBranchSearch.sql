CREATE PROC [dbo].vnsp_RootBranch_RootBranchSearch
(
	@pageSize INT,
	@pageSkip INT,
	@txtSearch NVARCHAR(500),
	@provinceId INT,
	@districtId INT,
	@txtWard NVARCHAR(500)
)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX) = '',
			@condition NVARCHAR(MAX) = ''
    SET @sql = ' 
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
            FROM Province Pr ';

    IF (@provinceId != 0 AND LEN(@provinceId)!=0)
    BEGIN
        SET @sql = @sql + '
			WHERE Pr.ProvinceId = '+ CAST(@provinceId AS NVARCHAR(50));
    END
	
	SET @sql = @sql + '
		) A ON Br.ProvinceId = A.ProvinceId
	JOIN (
			SELECT * FROM dbo.District D
	'
	
	IF (@districtId != 0 AND LEN(@districtId)!=0)
	BEGIN
		SET @sql = @sql + '
			WHERE D.DistrictId = '+ CAST(@districtId AS NVARCHAR(50));
	END
    
	SET @sql = @sql + '
		) B ON Br.DistrictId = B.DistrictId
	'

	IF (@txtWard IS NOT NULL OR LEN(@txtWard)!=0)
	BEGIN
		SET @sql = @sql + '
		WHERE Br.Address LIKE N''%' + @txtWard + '%''';
		SET @condition = ' AND '
	END
	ELSE SET @condition = ' WHERE '

	IF (@txtSearch IS NOT NULL AND LEN(@txtSearch)!=0)
    BEGIN
		SET @sql = @sql + @condition
        SET @sql = @sql + ' 
			Br.RootBranchId IN (
					SELECT DISTINCT P.RootBranchId FROM dbo.RootPerson P
					WHERE P.Name LIKE N''%' + @txtSearch + '%''
				)
			';
    END

    SET @sql = @sql + ' ORDER BY Br.Name ASC ';
	
	IF (@pageSize != -1 AND @pageSkip != -1) 
	BEGIN
		SET @sql = @sql + '
			OFFSET ' + CAST(@pageSkip AS VARCHAR(20)) + ' ROWS
			FETCH NEXT ' + CAST(@pageSize AS VARCHAR(20)) + ' ROWS ONLY ';
	END

	EXEC(@sql)
	PRINT(@sql)
END
