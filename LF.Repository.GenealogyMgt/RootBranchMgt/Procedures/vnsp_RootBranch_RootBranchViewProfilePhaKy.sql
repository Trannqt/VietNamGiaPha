CREATE PROC vnsp_RootBranch_RootBranchViewProfilePhaKy
(
	@Id INT
)
AS
BEGIN
	SELECT ContentPhaKy
	FROM dbo.RootBranch
	WHERE RootBranchId = @Id
END