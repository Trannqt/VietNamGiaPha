CREATE PROC [dbo].[vnsp_RootPost_RootPostGetById]
(
	@Id INT
)
AS
BEGIN
    DECLARE @query NVARCHAR(MAX)=''
	SET @query = @query + N'
		SELECT *
		FROM RootPost P
		WHERE P.RootPostId = ' + CONVERT(VARCHAR(20),@Id)

	EXEC (@query)
END
