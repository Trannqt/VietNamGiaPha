CREATE PROC vnsp_RootBranch_RootBranchViewProfileTocUoc
(
	@Id INT
)
AS
BEGIN
	SELECT ContentTocUoc
	FROM dbo.RootBranch
	WHERE RootBranchId = @Id
END