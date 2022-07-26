CREATE PROC vnsp_RootBranch_RootBranchViewProfileThuyTo
(
	@Id INT
)
AS
BEGIN
	SELECT ContentThuyTo
	FROM dbo.RootBranch
	WHERE RootBranchId = @Id
END