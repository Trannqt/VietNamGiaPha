CREATE PROC [dbo].[vngp_RootPerson_RootPersonSearchAndGetTotalPagesByBranchId]
(
	@BranchId INT
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
                            RP.RootBranchId ,
                            RP.SortOrder ,
                            Father.SortOrder FS ,
                            RP1.maxLevel ,
                            1 isDefault
                  FROM      dbo.RootPerson RP
                            LEFT JOIN ( SELECT  *
                                        FROM    dbo.RootPerson
                                      ) Father ON Father.RootPersonId = RP.FatherRootPersonId
                            LEFT JOIN ( SELECT  RP1.RootBranchId ,
                                                MAX(RP1.Level) maxLevel
                                        FROM    RootPerson RP1
                                        WHERE   RP1.RootBranchId = @BranchId
                                        GROUP BY RP1.RootBranchId
                                      ) RP1 ON RP1.RootBranchId = RP.RootBranchId
                  WHERE     1 = 1
                            AND RP.RootBranchId = @BranchId
                  UNION
                  SELECT    CASE WHEN RPR.RootBranchId = @BranchId
                                 THEN RPR1.RootPersonId
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
                            CASE WHEN RPR.RootBranchId = @BranchId
                                 THEN RPR1.RootBranchId
                                 ELSE RPR.RootBranchId
                            END RootBranchId ,
                            CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.SortOrder
                                 ELSE RPR.SortOrder
                            END SortOrder ,
                            CASE WHEN RPR.RootBranchId = @BranchId THEN RPR1.Fs
                                 ELSE RPR.Fs
                            END SortOrder ,
                            CASE WHEN RPR.RootBranchId = @BranchId
                                 THEN RPR1.PartnerMaxLevel
                                 ELSE RPR.PartnerMaxLevel
                            END maxLevel ,
                            0 isDefault
                  FROM      dbo.RootPersonRelationMap RPRM
                            LEFT JOIN ( SELECT  A.* ,
                                                F.SortOrder Fs
                                        FROM    ( SELECT    RootPersonId ,
                                                            RootBranchId ,
                                                            Name ,
                                                            Sex ,
                                                            SortOrder ,
                                                            Level ,
                                                            MAX(Level) PartnerMaxLevel
                                                  FROM      dbo.RootPerson
                                                  GROUP BY  RootPersonId ,
                                                            RootBranchId ,
                                                            Name ,
                                                            Sex ,
                                                            SortOrder ,
                                                            Level
                                                ) A
                                                LEFT JOIN ( SELECT
                                                              *
                                                            FROM
                                                              dbo.RootPerson
                                                          ) F ON F.FatherRootPersonId = A.RootPersonId
                                      ) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
                            LEFT JOIN ( SELECT  B.* ,
                                                F1.SortOrder Fs
                                        FROM    ( SELECT    RootPersonId ,
                                                            RootBranchId ,
                                                            Name ,
                                                            Sex ,
                                                            SortOrder ,
                                                            Level ,
                                                            MAX(Level) PartnerMaxLevel
                                                  FROM      dbo.RootPerson
                                                  GROUP BY  RootPersonId ,
                                                            RootBranchId ,
                                                            Name ,
                                                            Sex ,
                                                            SortOrder ,
                                                            Level
                                                ) B
                                                LEFT JOIN ( SELECT
                                                              *
                                                            FROM
                                                              dbo.RootPerson
                                                          ) F1 ON F1.FatherRootPersonId = B.RootPersonId
                                      ) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
                  WHERE     RPR.RootBranchId = @BranchId
                            OR RPR1.RootBranchId = @BranchId
                  UNION
                  SELECT    Children.RootPersonId ,
                            Children.Level ,
                            CASE WHEN Children.Sex = 1 THEN N''Nam''
                                 ELSE N''Nữ''
                            END Sex ,
                            Children.Name ,
                            Children.RootBranchId ,
                            Children.SortOrder ,
                            F.SortOrder FS ,
                            NULL maxLevel ,
                            0 isDefault
                  FROM      dbo.RootPerson Children
                            INNER JOIN ( SELECT RP.RootPersonId ,
                                                RP.Name
                                         FROM   dbo.RootPerson RP
                             LEFT JOIN ( SELECT
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR.RootPersonId
                                                              ELSE RPR1.RootPersonId
                                                              END RootPersonId ,
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR1.RootPersonId
                                                              ELSE RPR.RootPersonId
                                                              END PartnerPersonId ,
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR1.RootBranchId
                                                              ELSE RPR.RootBranchId
                                                              END PartnerBranchId ,
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR1.Name
                                                              ELSE RPR.Name
                                                              END PartnerName ,
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR1.Level
                                                              ELSE RPR.Level
                                                              END PartnerLevel ,
                                                              CASE
                                                              WHEN RPR.RootBranchId = @BranchId
                                                              THEN RPR1.PartnerMaxLevel
                                                              ELSE RPR.PartnerMaxLevel
                                                              END PartnerMaxLevel ,
                                                              RPRM.WeddingDate ,
                                                              RPRM.Note
                                                            FROM
                                                              dbo.RootPersonRelationMap RPRM
                                                              LEFT JOIN ( SELECT
                                                              RPR.RootPersonId ,
                                                              RPR.RootBranchId ,
                                                              RPR.Name ,
                                                              RPR.Level ,
                                                              MAX(RPR.Level) PartnerMaxLevel
                                                              FROM
                                                              dbo.RootPerson RPR
                                                              GROUP BY RPR.RootPersonId ,
                                                              RPR.RootBranchId ,
                                                              RPR.Name ,
                                                              RPR.Level
                                                              ) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
                                                              LEFT JOIN ( SELECT
                                                              RPR1.RootPersonId ,
                                                              RPR1.RootBranchId ,
                                                              RPR1.Name ,
                                                              RPR1.Level ,
                                                              MAX(RPR1.Level) PartnerMaxLevel
                                                              FROM
                                                              dbo.RootPerson RPR1
                                                              GROUP BY RPR1.RootPersonId ,
                                                              RPR1.RootBranchId ,
                                                              RPR1.Name ,
                                                              RPR1.Level
                                                              ) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
                                                            WHERE
                                                              RPR.RootBranchId = @BranchId
                                                              OR RPR1.RootBranchId = @BranchId
                                                          ) RM ON RM.RootPersonId = RP.RootPersonId
                                         WHERE  RP.RootBranchId = @BranchId
                                                AND RP.Sex = 0
                                                AND RM.PartnerPersonId IS NOT NULL
                                       ) Mother ON Mother.RootPersonId = Children.MotherRootPersonId
                            LEFT JOIN ( SELECT  *
                                        FROM    dbo.RootPerson
                                      ) F ON F.RootPersonId = Children.FatherRootPersonId
                ) Rs
        ORDER BY Rs.isDefault DESC,
                Rs.Level DESC ,
                Rs.FS DESC ,
                Rs.SortOrder DESC
	';

	EXECUTE sp_executesql @query, N'@BranchId INT', @BranchId = @BranchId
	SELECT @query
	--PRINT (@query)
END
