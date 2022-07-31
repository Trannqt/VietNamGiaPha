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
		SET @sql = @sql + ' AND Type = @type'

	IF (LEN(@txtSearch)>0 AND @txtSearch <> '')
    BEGIN
		SET @sql = @sql + @condition
        SET @sql = @sql + ' 
			AND ( 
				P.Title LIKE N''%@txtSearch%'' 
				OR P.TextThumbnail LIKE N''%@txtSearch%'' 
				OR P.Description LIKE N''%@txtSearch%'' 
			)';
    END

    SET @sql = @sql + ' ORDER BY P.CreateDate DESC ';

    IF (@pageSize != -1 AND @pageSkip != -1) 
	BEGIN
        SET @sql = @sql + '
            OFFSET @pageSkip ROWS
            FETCH NEXT @pageSize ROWS ONLY ';
    END

	DECLARE @declareParams NVARCHAR(1000) = N'
		@pageSize INT,
		@pageSkip INT,
		@txtSearch NVARCHAR(500),
		@type INT
	';
	EXECUTE sp_executesql @sql, @declareParams, 
							@pageSize = @pageSize,
							@pageSkip = @pageSkip,
							@txtSearch = @txtSearch,
							@type = @type
END
