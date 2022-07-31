CREATE PROC [dbo].[vnsp_RootPost_RootPostGetById]
(
	@Id INT
)
AS
BEGIN
	SELECT *
	FROM dbo.RootPost P
	WHERE P.RootPostId = @Id;
END
