CREATE PROC [dbo].[vnsp_RootPost_RootPostSearch]
(
	@pageSize INT,
	@pageSkip INT,
	@txtSearch NVARCHAR(500),
	@type INT
)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX) = '',
			@condition NVARCHAR(MAX) = ' AND '
	SET @condition =  ' '
    SET @sql = ' 
	SELECT	*
	FROM RootPost P 
	WHERE 1=1 '

	IF (@type<>0)
		SET @sql = @sql + ' AND Type = ' + CAST(@type AS VARCHAR(20))

	IF (@txtSearch IS NOT NULL AND LEN(@txtSearch)!=0)
    BEGIN
		SET @sql = @sql + @condition
        SET @sql = @sql + ' 
			AND ( 
				P.Title LIKE N''%' + @txtSearch + '%'' 
				OR P.TextThumbnail LIKE N''%' + @txtSearch + '%'' 
				OR P.Description LIKE N''%' + @txtSearch + '%'' 
			)';
    END

    SET @sql = @sql + ' ORDER BY P.CreateDate DESC ';

    IF (@pageSize != -1 AND @pageSkip != -1) 
	BEGIN
        SET @sql = @sql + '
            OFFSET ' + CAST(@pageSkip AS VARCHAR(20)) + ' ROWS
            FETCH NEXT ' + CAST(@pageSize AS VARCHAR(20)) + ' ROWS ONLY ';
    END

	EXEC(@sql)
	PRINT(@sql)
END
