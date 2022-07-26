CREATE PROC [dbo].[vnsp_RootBranch_RootBranchIndex]
(
	@BranchId INT
)
AS
BEGIN
	SELECT A.*, B.LevelBranch, C.FamilyNumber, D.PersonNumber
	FROM(
		SELECT * 
		FROM dbo.RootBranch
		WHERE RootBranchId = @BranchId
	) A
	LEFT JOIN
	(
		SELECT RootBranchId, MAX(Level) LevelBranch
		FROM dbo.RootPerson 
		GROUP BY RootBranchId
	) B ON B.RootBranchId = A.RootBranchId
	LEFT JOIN
	(
		SELECT RootBranchId, COUNT(*) FamilyNumber
		FROM (
			SELECT DISTINCT RootBranchId, FatherRootPersonId, MotherRootPersonId
			FROM dbo.RootPerson
			WHERE RootBranchId = @BranchId AND (FatherRootPersonId IS NOT NULL OR MotherRootPersonId IS NOT NULL)
		) C
		GROUP BY C.RootBranchId
	) C ON C.RootBranchId = A.RootBranchId
	LEFT JOIN
	(
		SELECT RootBranchId, COUNT(*) PersonNumber
		FROM dbo.RootPerson
		WHERE RootBranchId = @BranchId
		GROUP BY RootBranchId
	) D ON D.RootBranchId = A.RootBranchId
END