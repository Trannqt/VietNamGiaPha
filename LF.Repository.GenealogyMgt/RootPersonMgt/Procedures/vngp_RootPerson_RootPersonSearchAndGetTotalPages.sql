CREATE PROC [dbo].[vngp_RootPerson_RootPersonSearchAndGetTotalPages]
(
	@BranchId INT,
	@txtSearch NVARCHAR(1000)
)
AS
BEGIN
	DECLARE @query NVARCHAR(MAX) = N'',
			@strBranch NVARCHAR(MAX) = N''

	IF @BranchId<>''
		SET @strBranch =N' AND RP.RootBranchId = '+CAST(@BranchId AS VARCHAR(10))

	SET @query = N'
		
        SELECT  ROW_NUMBER() OVER ( ORDER BY ( SELECT   NULL
                                             ) ) STT ,
                Rs.*
        FROM    ( SELECT    RP.RootPersonId ,
                            RP.Level ,
                            CASE WHEN RP.Sex = 1 THEN N''Nam''
                                 ELSE N''Nữ''
                            END Sex ,
                            RP.Name ,
							RP.Phone,
							ISNULL(FORMAT(RP.DateOfBirth,''dd/MM/yyyy''),'''') DateOfBirth,
							Me.DateOfDeath,
							Father.Name FatherName,
							Mother.Name MotherName,
							RBr.Name BranchName,
							RP.ImageLink,
                            RP.RootBranchId ,
                            RP.SortOrder ,
                            Father.SortOrder FS ,
                            RP1.maxLevel ,
                            1 isDefault
				  FROM      dbo.RootPerson RP
                            LEFT JOIN ( SELECT  *
                                        FROM    dbo.RootPerson
                                      ) Father ON Father.RootPersonId = RP.FatherRootPersonId
							LEFT JOIN ( SELECT  *
                            FROM    dbo.RootPerson
                            ) Mother ON Mother.RootPersonId = RP.MotherRootPersonId
							LEFT JOIN (
								SELECT RootBranchId, Name
								FROM RootBranch 
							) RBr ON RBr.RootBranchId = RP.RootBranchId
							LEFT JOIN
							(
								SELECT ISNULL(FORMAT(DateOfDeath,''dd/MM/yyyy''),'''') DateOfDeath, RootPersonId
								FROM dbo.RootPersonMemory
							) Me ON Me.RootPersonId = RP.RootPersonId
                            LEFT JOIN ( SELECT  RP1.RootBranchId ,
                                                MAX(RP1.Level) maxLevel
                                        FROM    RootPerson RP1
                                        WHERE   RP1.RootBranchId = @BranchId
                                        GROUP BY RP1.RootBranchId
                                      ) RP1 ON RP1.RootBranchId = RP.RootBranchId
                  WHERE     1 = 1
                            AND RP.RootBranchId = @BranchId
                  UNION
                  SELECT  CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.RootPersonId
								ELSE RPR.RootPersonId
						END RootPersonId ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.Level
								ELSE RPR.Level
						END Level ,
						CASE WHEN RPR.RootBranchId = @BranchId
								THEN ( CASE WHEN RPR1.Sex = 1 THEN N''Nam''
											ELSE N''Nữ''
									END )
								ELSE ( CASE WHEN RPR.Sex = 1 THEN N''Nam''
											ELSE N''Nữ''
									END )
						END Sex ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.Name
								ELSE RPR.Name
						END Name ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.Phone
								ELSE RPR.Phone
						END Phone ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN ISNULL(FORMAT(RPR1.DateOfBirth,''dd/MM/yyyy''),'''')  
								ELSE ISNULL(FORMAT(RPR.DateOfBirth,''dd/MM/yyyy''),'''')  
						END DateOfBirth ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.DateOfDeath
								ELSE RPR.DateOfDeath
						END DateOfDeath ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.FatherName
								ELSE RPR.FatherName
						END FatherName ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.MotherName
								ELSE RPR.MotherName
						END MotherName ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.BranchName
							 ELSE RPR.BranchName
						END BranchName ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.ImageLink
								ELSE RPR.ImageLink
						END ImageLink ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.RootBranchId
								ELSE RPR.RootBranchId
						END RootBranchId ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.SortOrder
								ELSE RPR.SortOrder
						END SortOrder ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.Fs
								ELSE RPR.Fs
						END FS ,
						CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.PartnerMaxLevel
								ELSE RPR.PartnerMaxLevel
						END maxLevel ,
						0 isDefault
				FROM    dbo.RootPersonRelationMap RPRM
						LEFT JOIN ( SELECT  TempPartner1.* ,
											FatherPartner1.SortOrder Fs,
											MemoryPartner1.DateOfDeath,
											FatherPartner1.Name FatherName,
											MotherPartner1.Name MotherName,
											RBrPartner1.Name BranchName
							
									FROM    ( SELECT    RootPersonId ,
														RootBranchId ,
														Name ,
														Sex ,
														SortOrder ,
														Level ,
														DateOfBirth,
														ImageLink,
														FatherRootPersonId,
														Phone,
														MAX(Level) PartnerMaxLevel
												FROM      dbo.RootPerson
												GROUP BY  RootPersonId ,
														RootBranchId ,
														Name ,
														Sex ,
														SortOrder ,
														Level,
														DateOfBirth,
														ImageLink,
														FatherRootPersonId,
														Phone
											) TempPartner1
											LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
														FROM    dbo.RootPerson
														) FatherPartner1 ON FatherPartner1.RootPersonId = TempPartner1.FatherRootPersonId
											LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
														FROM    dbo.RootPerson
														) MotherPartner1 ON MotherPartner1.RootPersonId = TempPartner1.FatherRootPersonId
											LEFT JOIN (
												SELECT RootBranchId, Name
												FROM RootBranch 
											) RBrPartner1 ON RBrPartner1.RootBranchId = TempPartner1.RootBranchId
											LEFT JOIN
											(
												SELECT ISNULL(FORMAT(DateOfDeath,''dd/MM/yyyy''),'''') DateOfDeath, RootPersonId
												FROM dbo.RootPersonMemory
											) MemoryPartner1 ON MemoryPartner1.RootPersonId = TempPartner1.RootPersonId
									) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
						LEFT JOIN ( SELECT  TempPartner2.* ,
											FatherPartner2.SortOrder Fs,
											MemoryPartner2.DateOfDeath,
											FatherPartner2.Name FatherName,
											MotherPartner2.Name MotherName,
											RBrPartner2.Name BranchName
							
									FROM    ( SELECT    RootPersonId ,
														RootBranchId ,
														Name ,
														Sex ,
														SortOrder ,
														Level ,
														DateOfBirth,
														ImageLink,
														FatherRootPersonId,
														Phone,
														MAX(Level) PartnerMaxLevel
												FROM      dbo.RootPerson
												GROUP BY  RootPersonId ,
														RootBranchId ,
														Name ,
														Sex ,
														SortOrder ,
														Level,
														DateOfBirth,
														ImageLink,
														FatherRootPersonId,
														Phone
											) TempPartner2
											LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
														FROM    dbo.RootPerson
														) FatherPartner2 ON FatherPartner2.RootPersonId = TempPartner2.FatherRootPersonId
											LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
														FROM    dbo.RootPerson
														) MotherPartner2 ON MotherPartner2.RootPersonId = TempPartner2.FatherRootPersonId
											LEFT JOIN (
												SELECT RootBranchId, Name
												FROM RootBranch 
											) RBrPartner2 ON RBrPartner2.RootBranchId = TempPartner2.RootBranchId
											LEFT JOIN
											(
												SELECT ISNULL(FORMAT(DateOfDeath,''dd/MM/yyyy''),'''') DateOfDeath, RootPersonId
												FROM dbo.RootPersonMemory
											) MemoryPartner2 ON MemoryPartner2.RootPersonId = TempPartner2.RootPersonId
									) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
				WHERE   RPR.RootBranchId = @BranchId
						OR RPR1.RootBranchId = @BranchId
                  UNION
                  SELECT  Children.RootPersonId ,
						Children.Level ,
						CASE WHEN Children.Sex = 1 THEN N''Nam''
							 ELSE N''Nữ''
						END Sex ,
						Children.Name ,
						Children.Phone,
						ISNULL(FORMAT(Children.DateOfBirth,''dd/MM/yyyy''),'''') DateOfBirth, 
						ISNULL(FORMAT(MemoryChild.DateOfDeath,''dd/MM/yyyy''),'''') DateOfDeath,  
						FatherChild.Name FatherName,
						Mother.Name MotherName,
						RBrChild.Name BranchName,
						Children.ImageLink,
						Children.RootBranchId ,
						Children.SortOrder ,
						FatherChild.SortOrder FS ,
						NULL maxLevel ,
						0 isDefault
				FROM    dbo.RootPerson Children
						INNER JOIN ( SELECT RP.RootPersonId ,
											RP.Name
									 FROM   dbo.RootPerson RP
											LEFT JOIN ( SELECT  CASE WHEN RPR.RootBranchId = @BranchId
																	 THEN RPR.RootPersonId
																	 ELSE RPR1.RootPersonId
																END RootPersonId ,
																CASE WHEN RPR.RootBranchId = @BranchId
																	 THEN RPR1.RootPersonId
																	 ELSE RPR.RootPersonId
																END PartnerPersonId ,
																CASE WHEN RPR.RootBranchId = @BranchId
																	 THEN RPR1.Name
																	 ELSE RPR.Name
																END PartnerName 
														FROM    dbo.RootPersonRelationMap RPRM
																LEFT JOIN ( SELECT
																			  RPR.RootPersonId ,
																			  RPR.RootBranchId ,
																			  RPR.Name
																			FROM
																			  dbo.RootPerson RPR
																		  ) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
																LEFT JOIN ( SELECT
																			  RPR1.RootPersonId ,
																			  RPR1.RootBranchId ,
																			  RPR1.Name
																			FROM
																			  dbo.RootPerson RPR1
																		  ) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
														WHERE   RPR.RootBranchId = @BranchId
																OR RPR1.RootBranchId = @BranchId
													  ) RM ON RM.RootPersonId = RP.RootPersonId
									 WHERE  RP.RootBranchId = @BranchId
											AND RP.Sex = 0 --Mẹ là nữ == 0
											AND RM.PartnerPersonId IS NOT NULL
								   ) Mother ON Mother.RootPersonId = Children.MotherRootPersonId
						LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
									FROM    dbo.RootPerson
									) FatherChild ON FatherChild.RootPersonId = Children.FatherRootPersonId
						LEFT JOIN ( SELECT  RootPersonId, SortOrder, Name
									FROM    dbo.RootPerson
									) MotherChild ON MotherChild.RootPersonId = Children.FatherRootPersonId
						LEFT JOIN (
							SELECT RootBranchId, Name
							FROM RootBranch 
						) RBrChild ON RBrChild.RootBranchId = Children.RootBranchId
						LEFT JOIN
						(
							SELECT DateOfDeath, RootPersonId
							FROM dbo.RootPersonMemory
						) MemoryChild ON MemoryChild.RootPersonId = Children.RootPersonId
                ) Rs ';
	IF LEN(@txtSearch)>0
		SET @query = @query + '
			WHERE Rs.Name LIKE N''%@txtSearch%''';
	
	SET @query = @query + '		
        ORDER BY Rs.isDefault DESC,
                Rs.Level DESC ,
                Rs.FS DESC ,
                Rs.SortOrder DESC
	';

	EXECUTE sp_executesql @query, N'@BranchId INT, @txtSearch NVARCHAR(1000)', @BranchId = @BranchId, @txtSearch = @txtSearch
	SELECT @query
	--PRINT (@query)
END