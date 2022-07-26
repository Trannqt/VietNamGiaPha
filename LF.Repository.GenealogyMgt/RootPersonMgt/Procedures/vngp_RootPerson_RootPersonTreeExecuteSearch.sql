CREATE PROC [dbo].[vngp_RootPerson_RootPersonTreeExecuteSearch]
(
	@BranchId INT,
	@PersonId INT,
	@Level INT,
	@MaxLevel INT
)
AS
BEGIN
		DECLARE @query NVARCHAR(MAX) = N'',
				@w_Level VARCHAR(MAX) = '',
				@strBranch VARCHAR(MAX) = '',
				@strBranch1 VARCHAR(MAX) = '',
				@strPerson VARCHAR(MAX) = ''
		
		
		IF @BranchId <>''
		BEGIN
			SET @strBranch = N' AND RP.RootBranchId = '+ CAST(@BranchId AS VARCHAR(10)) 
			SET @strBranch1 = N' AND Rs.RootBranchId = '+ CAST(@BranchId AS VARCHAR(10)) 
		END

		IF @PersonId <>''
		BEGIN
			SET @strPerson = N' AND RP.RootPersonId = '+ CAST(@PersonId AS VARCHAR(10))
		END
		
		IF @Level=0
			SET @w_Level = N' (0,1,2) '
		ELSE IF @Level >= @MaxLevel 
			SET @w_Level = ' ('+CAST((@Level-2) AS VARCHAR(10))+','+CAST((@Level-1) AS VARCHAR(10))+','+CAST((@Level) AS VARCHAR(10))+') '
		ELSE
			SET @w_Level = ' ('+CAST((@Level-1) AS VARCHAR(10))+','+CAST(@Level AS VARCHAR(10))+','+CAST((@Level+1) AS VARCHAR(10))+') '

		SET @query = @query + N'
		IF OBJECT_ID(''tempdb..#tmpTable'') IS NOT NULL DROP TABLE #tmpTable
		IF OBJECT_ID(''tempdb..#tmpMain'') IS NOT NULL DROP TABLE #tmpMain
		IF OBJECT_ID(''tempdb..#tmpMain1'') IS NOT NULL DROP TABLE #tmpMain1
		IF OBJECT_ID(''tempdb..#tmpMain2'') IS NOT NULL DROP TABLE #tmpMain2
		IF OBJECT_ID(''tempdb..#tmpMain3'') IS NOT NULL DROP TABLE #tmpMain3

		IF OBJECT_ID(''tempdb..#tmpR1'') IS NOT NULL DROP TABLE #tmpR1
		IF OBJECT_ID(''tempdb..#tmpR2'') IS NOT NULL DROP TABLE #tmpR2
		IF OBJECT_ID(''tempdb..#tmpR3'') IS NOT NULL DROP TABLE #tmpR3


		IF OBJECT_ID(''tempdb..#tmpRR1'') IS NOT NULL DROP TABLE #tmpRR1
		IF OBJECT_ID(''tempdb..#tmpRR2'') IS NOT NULL DROP TABLE #tmpRR2
		IF OBJECT_ID(''tempdb..#tmpRR3'') IS NOT NULL DROP TABLE #tmpRR3


		IF OBJECT_ID(''tempdb..#tmpRRR1'') IS NOT NULL DROP TABLE #tmpRRR1
		IF OBJECT_ID(''tempdb..#tmpRRR2'') IS NOT NULL DROP TABLE #tmpRRR2
		IF OBJECT_ID(''tempdb..#tmpRRR3'') IS NOT NULL DROP TABLE #tmpRRR3


		SELECT	
				RP.RootPersonId id,
				RP.FatherRootPersonId pid, 
				RP.Name name
		INTO #tmpTable
		FROM dbo.RootPerson RP
		WHERE 1=1 ' + @strBranch + N' 
					AND RP.Level IN '+ @w_Level +N'

		SELECT *
		INTO #tmpMain
		FROM(
			SELECT M1.*, M2.id t3id, M2.pid t3pid, M2.name t3name
			FROM(
				SELECT T1.id, T1.pid, T1.name, T2.id t2id, T2.pid t2pid, T2.name t2name
				FROM #tmpTable T1
				LEFT JOIN( 
					SELECT * 
					FROM #tmpTable 
				) T2 ON T2.id = T1.pid
			) M1
			LEFT JOIN(
				SELECT * 
				FROM #tmpTable 
			) M2 ON M2.id = M1.t2Pid
		) A

		IF EXISTS(
			SELECT * 
			FROM #tmpMain M
			WHERE M.t3id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
		)
		BEGIN
			SELECT *
			INTO #tmpR1
			FROM(
				SELECT B.*
				FROM(
					SELECT STT, ids, parent
					FROM(
						SELECT ROW_NUMBER() OVER(ORDER BY(SELECT NULL)) STT, * 
						FROM #tmpMain M
						WHERE M.t3id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
					) src
					UNPIVOT
					(
						ids FOR parent IN (id,t2id,t3id)
					) pvt1
				) A
				INNER JOIN (
					SELECT *
					FROM dbo.RootPerson 
				) B ON B.RootPersonId = A.ids
			) C

			SELECT DISTINCT R1.* 
			INTO #tmpRR1
			FROM dbo.RootPerson R1
			JOIN(
				SELECT *
				FROM #tmpR1
			) R2 ON R1.FatherRootPersonId = R2.RootPersonId 
			OR R1.RootPersonId = R2.RootPersonId

				SELECT	Rs.RootPersonId id,
						Rs.Name name,
						Rs.FatherRootPersonId pid,
						Rs.ImageLink img,
						'''' tags,
						Rs.PartnerPersonId,
						Rs.RootBranchId,
						Rs.Level,
						Rs.Sex,
						Rs.Phone
				INTO #tmpRRR1
				FROM(
						SELECT	
								RP.RootPersonId,
								RP.Level, 
								RP.Name, 
								RP.FatherRootPersonId, 
								RP.MotherRootPersonId, 
								ISNULL(Father.Name,'''') FatherName, 
								ISNULL(Mother.Name,'''') MotherName,
								Father.SortOrder FS,
								FORMAT(RP.DateOfBirth,''dd/MM/yyyy'') DateOfBirth, 
								CASE 
									WHEN RP.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
								END Sex,
								ISNULL(RP.Address,'''') Address,
								ISNULL(RP.Phone,'''') Phone,
								RP.SortOrder,
								RP.RootBranchId,
								RM.PartnerPersonId,
								RM.WeddingDate,
								RM.PartnerBranchId,
								RM.PartnerLevel,
								ISNULL(RM.PartnerName,'''') PartnerName,
								CASE
									WHEN RMemory.DateOfDeath IS NULL THEN N''Còn sống'' ELSE N''Đã mất'' 
								END Death,
								RMemory.DateOfDeath,
								RMemory.LunarDateOfDeath,
								RM.PartnerMaxLevel,
								Father.Level FatherLevel,
								Father.RootBranchId FatherBranchId,
								Mother.Level MotherLevel,
								Mother.RootBranchId MotherBranchId,
								RP1.maxLevel,
								RP.ImageLink
						FROM #tmpRR1 RP
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Father ON Father.RootPersonId = RP.FatherRootPersonId
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Mother ON Mother.RootPersonId = RP.MotherRootPersonId
						LEFT JOIN(
							SELECT RP1.RootBranchId, MAX(RP1.Level) maxLevel
							FROM RootPerson RP1
							WHERE RP1.RootBranchId = 1
							GROUP BY  RP1.RootBranchId
						) RP1 ON RP1.RootBranchId = RP.RootBranchId
						LEFT JOIN(
							SELECT	CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR.RootPersonId
												ELSE  RPR1.RootPersonId
									END RootPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.RootPersonId
												ELSE  RPR.RootPersonId
									END PartnerPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.RootBranchId
												ELSE RPR.RootBranchId
									END PartnerBranchId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.Name
												ELSE RPR.Name
									END PartnerName,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.Level
												ELSE RPR.Level
									END PartnerLevel,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.PartnerMaxLevel
												ELSE RPR.PartnerMaxLevel
									END PartnerMaxLevel,
									RPRM.WeddingDate,
									RPRM.Note
							FROM dbo.RootPersonRelationMap RPRM
							LEFT JOIN(
								SELECT RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level, MAX(RPR.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR 
								GROUP BY RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level
							) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
							LEFT JOIN(
								SELECT RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level, MAX(RPR1.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR1 
								GROUP BY RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level
							) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
							WHERE RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
							OR RPR1.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
						) RM ON RM.RootPersonId = RP.RootPersonId  
						LEFT JOIN(
							SELECT *
							FROM dbo.RootPersonMemory
						) RMemory ON RMemory.RootPersonId = RP.RootPersonId
				) Rs
			
				--ketqua
				SELECT DISTINCT A.id,
								A.name,
								A.pid,
								A.img,
								A.tags,
								NULL AS PartnerPersonId,
								A.RootBranchId,
								A.Level,
								A.Sex,
								A.Phone
				FROM(
					SELECT * FROM #tmpRRR1
					WHERE 1=1  AND Level IN '+@w_Level+N' 
					AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					UNION
					SELECT	PN.RootPersonId id,
							PN.Name name,
							T.id pid,
							PN.ImageLink img,
							''partner'' tags,
							PN.RootPersonId,
							PN.RootBranchId,
							PN.Level,
							CASE 
								WHEN PN.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(PN.Phone,'''') Phone
					FROM dbo.RootPerson PN
					INNER JOIN(
						SELECT *
						FROM #tmpRRR1
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T ON T.PartnerPersonId = PN.RootPersonId
					
					UNION
					SELECT Child.RootPersonId id,
							Child.Name name,
							T1.id pid,
							Child.ImageLink img,
							'''' tags,
							Child.RootPersonId,
							Child.RootBranchId,
							Child.Level,
							CASE 
								WHEN Child.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(Child.Phone,'''') Phone
					FROM dbo.RootPerson Child
					INNER JOIN (
						SELECT * 
						FROM #tmpRRR1
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T1 ON T1.id = Child.MotherRootPersonId
				) A 
		END
		ELSE IF EXISTS(
			SELECT * 
			FROM #tmpMain M
			WHERE M.t2id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
		)
		BEGIN
			SELECT *
			INTO #tmpR2
			FROM(
				SELECT B.*
				FROM(
					SELECT STT, ids, parent
					FROM(
						SELECT ROW_NUMBER() OVER(ORDER BY(SELECT NULL)) STT, * 
						FROM #tmpMain M
						WHERE M.t2id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
					) src
					UNPIVOT
					(
						ids FOR parent IN (id,t2id,t3id)
					) pvt1
				) A
				INNER JOIN (
					SELECT *
					FROM dbo.RootPerson 
				) B ON B.RootPersonId = A.ids
			) C

			SELECT DISTINCT R1.* 
			INTO #tmpRR2
			FROM dbo.RootPerson R1
			JOIN(
				SELECT *
				FROM #tmpR2
			) R2 ON R1.FatherRootPersonId = R2.RootPersonId 
			OR R1.RootPersonId = R2.RootPersonId

				SELECT	Rs.RootPersonId id,
						Rs.Name name,
						Rs.FatherRootPersonId pid,
						Rs.ImageLink img,
						'''' tags,
						Rs.PartnerPersonId,
						Rs.RootBranchId,
						Rs.Level,
						Rs.Sex,
						Rs.Phone
				INTO #tmpRRR2
				FROM(
						SELECT	
								RP.RootPersonId,
								RP.Level, 
								RP.Name, 
								RP.FatherRootPersonId, 
								RP.MotherRootPersonId, 
								ISNULL(Father.Name,'''') FatherName, 
								ISNULL(Mother.Name,'''') MotherName,
								Father.SortOrder FS,
								FORMAT(RP.DateOfBirth,''dd/MM/yyyy'') DateOfBirth, 
								CASE 
									WHEN RP.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
								END Sex,
								ISNULL(RP.Address,'''') Address,
								ISNULL(RP.Phone,'''') Phone,
								RP.SortOrder,
								RP.RootBranchId,
								RM.PartnerPersonId,
								RM.WeddingDate,
								RM.PartnerBranchId,
								RM.PartnerLevel,
								ISNULL(RM.PartnerName,'''') PartnerName,
								CASE
									WHEN RMemory.DateOfDeath IS NULL THEN N''Còn sống'' ELSE N''Đã mất'' 
								END Death,
								RMemory.DateOfDeath,
								RMemory.LunarDateOfDeath,
								RM.PartnerMaxLevel,
								Father.Level FatherLevel,
								Father.RootBranchId FatherBranchId,
								Mother.Level MotherLevel,
								Mother.RootBranchId MotherBranchId,
								RP1.maxLevel,
								RP.ImageLink
						FROM #tmpRR2 RP
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Father ON Father.RootPersonId = RP.FatherRootPersonId
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Mother ON Mother.RootPersonId = RP.MotherRootPersonId
						LEFT JOIN(
							SELECT RP1.RootBranchId, MAX(RP1.Level) maxLevel
							FROM RootPerson RP1
							WHERE RP1.RootBranchId = 1
							GROUP BY  RP1.RootBranchId
						) RP1 ON RP1.RootBranchId = RP.RootBranchId
						LEFT JOIN(
							SELECT	CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR.RootPersonId
												ELSE  RPR1.RootPersonId
									END RootPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.RootPersonId
												ELSE RPR.RootPersonId
									END PartnerPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.RootBranchId
												ELSE RPR.RootBranchId
									END PartnerBranchId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.Name
												ELSE RPR.Name
									END PartnerName,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.Level
												ELSE RPR.Level
									END PartnerLevel,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.PartnerMaxLevel
												ELSE RPR.PartnerMaxLevel
									END PartnerMaxLevel,
									RPRM.WeddingDate,
									RPRM.Note
							FROM dbo.RootPersonRelationMap RPRM
							LEFT JOIN(
								SELECT RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level, MAX(RPR.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR 
								GROUP BY RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level
							) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
							LEFT JOIN(
								SELECT RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level, MAX(RPR1.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR1 
								GROUP BY RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level
							) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
							WHERE RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
							OR RPR1.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
						) RM ON RM.RootPersonId = RP.RootPersonId  
						LEFT JOIN(
							SELECT *
							FROM dbo.RootPersonMemory
						) RMemory ON RMemory.RootPersonId = RP.RootPersonId
				) Rs
			
				--ketqua
				SELECT DISTINCT A.id,
								A.name,
								A.pid,
								A.img,
								A.tags,
								NULL AS PartnerPersonId,
								A.RootBranchId,
								A.Level,
								A.Sex,
								A.Phone
				FROM(
					SELECT * FROM #tmpRRR2
					WHERE 1=1  AND Level IN '+@w_Level+N' 
					AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					UNION
					SELECT	PN.RootPersonId id,
							PN.Name name,
							T.id pid,
							PN.ImageLink img,
							''partner'' tags,
							PN.RootPersonId,
							PN.RootBranchId,
							PN.Level,
							CASE 
								WHEN PN.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(PN.Phone,'''') Phone
					FROM dbo.RootPerson PN
					INNER JOIN(
						SELECT *
						FROM #tmpRRR2
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T ON T.PartnerPersonId = PN.RootPersonId

					UNION
					SELECT Child.RootPersonId id,
							Child.Name name,
							T1.id pid,
							Child.ImageLink img,
							'''' tags,
							Child.RootPersonId,
							Child.RootBranchId,
							Child.Level,
							CASE 
								WHEN Child.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(Child.Phone,'''') Phone
					FROM dbo.RootPerson Child
					INNER JOIN (
						SELECT * 
						FROM #tmpRRR2
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T1 ON T1.id = Child.MotherRootPersonId
				) A 
		END
		ELSE IF EXISTS(
			SELECT * 
			FROM #tmpMain M
			WHERE M.id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
		)
		BEGIN
			SELECT *
			INTO #tmpR3
			FROM(
				SELECT B.*
				FROM(
					SELECT STT, ids, parent
					FROM(
						SELECT ROW_NUMBER() OVER(ORDER BY(SELECT NULL)) STT, * 
						FROM #tmpMain M
						WHERE M.id = '+ CAST(@PersonId AS VARCHAR(20)) +N'
					) src
					UNPIVOT
					(
						ids FOR parent IN (id,t2id,t3id)
					) pvt1
				) A
				INNER JOIN (
					SELECT *
					FROM dbo.RootPerson 
				) B ON B.RootPersonId = A.ids
			) C

			SELECT DISTINCT R1.* 
			INTO #tmpRR3
			FROM dbo.RootPerson R1
			JOIN(
				SELECT *
				FROM #tmpR3
			) R2 ON R1.FatherRootPersonId = R2.RootPersonId 
			OR R1.RootPersonId = R2.RootPersonId

				SELECT	Rs.RootPersonId id,
						Rs.Name name,
						Rs.FatherRootPersonId pid,
						Rs.ImageLink img,
						'''' tags,
						Rs.PartnerPersonId,
						Rs.RootBranchId,
						Rs.Level,
						Rs.Sex,
						Rs.Phone
				INTO #tmpRRR3
				FROM(
						SELECT	
								RP.RootPersonId,
								RP.Level, 
								RP.Name, 
								RP.FatherRootPersonId, 
								RP.MotherRootPersonId, 
								ISNULL(Father.Name,'''') FatherName, 
								ISNULL(Mother.Name,'''') MotherName,
								Father.SortOrder FS,
								FORMAT(RP.DateOfBirth,''dd/MM/yyyy'') DateOfBirth, 
								CASE 
									WHEN RP.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
								END Sex,
								ISNULL(RP.Address,'''') Address,
								ISNULL(RP.Phone,'''') Phone,
								RP.SortOrder,
								RP.RootBranchId,
								RM.PartnerPersonId,
								RM.WeddingDate,
								RM.PartnerBranchId,
								RM.PartnerLevel,
								ISNULL(RM.PartnerName,'''') PartnerName,
								CASE
									WHEN RMemory.DateOfDeath IS NULL THEN N''Còn sống'' ELSE N''Đã mất'' 
								END Death,
								RMemory.DateOfDeath,
								RMemory.LunarDateOfDeath,
								RM.PartnerMaxLevel,
								Father.Level FatherLevel,
								Father.RootBranchId FatherBranchId,
								Mother.Level MotherLevel,
								Mother.RootBranchId MotherBranchId,
								RP1.maxLevel,
								RP.ImageLink
						FROM #tmpRR3 RP
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Father ON Father.RootPersonId = RP.FatherRootPersonId
						LEFT JOIN(
							SELECT * 
							FROM dbo.RootPerson
						) Mother ON Mother.RootPersonId = RP.MotherRootPersonId
						LEFT JOIN(
							SELECT RP1.RootBranchId, MAX(RP1.Level) maxLevel
							FROM RootPerson RP1
							WHERE RP1.RootBranchId = 1
							GROUP BY  RP1.RootBranchId
						) RP1 ON RP1.RootBranchId = RP.RootBranchId
						LEFT JOIN(
							SELECT	CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR.RootPersonId
												ELSE  RPR1.RootPersonId
									END RootPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.RootPersonId
												ELSE  RPR.RootPersonId
									END PartnerPersonId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.RootBranchId
												ELSE RPR.RootBranchId
									END PartnerBranchId,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.Name
												ELSE RPR.Name
									END PartnerName,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
												THEN RPR1.Level
												ELSE RPR.Level
									END PartnerLevel,
									CASE 
											WHEN RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
												THEN RPR1.PartnerMaxLevel
												ELSE RPR.PartnerMaxLevel
									END PartnerMaxLevel,
									RPRM.WeddingDate,
									RPRM.Note
							FROM dbo.RootPersonRelationMap RPRM
							LEFT JOIN(
								SELECT RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level, MAX(RPR.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR 
								GROUP BY RPR.RootPersonId,RPR.RootBranchId,RPR.Name, RPR.Level
							) RPR ON RPR.RootPersonId = RPRM.RelationRootPersonId
							LEFT JOIN(
								SELECT RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level, MAX(RPR1.Level) PartnerMaxLevel 
								FROM dbo.RootPerson RPR1 
								GROUP BY RPR1.RootPersonId,RPR1.RootBranchId,RPR1.Name, RPR1.Level
							) RPR1 ON RPR1.RootPersonId = RPRM.RootPersonId
							WHERE RPR.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N' 
							OR RPR1.RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
						) RM ON RM.RootPersonId = RP.RootPersonId  
						LEFT JOIN(
							SELECT *
							FROM dbo.RootPersonMemory
						) RMemory ON RMemory.RootPersonId = RP.RootPersonId
				) Rs
			
				--ketqua
				SELECT DISTINCT A.id,
								A.name,
								A.pid,
								A.img,
								A.tags,
								NULL AS PartnerPersonId,
								A.RootBranchId,
								A.Level,
								A.Sex,
								A.Phone
				FROM(
					SELECT * FROM #tmpRRR3
					WHERE 1=1  AND Level IN '+@w_Level+N' 
					AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					UNION
					SELECT	PN.RootPersonId id,
							PN.Name name,
							T.id pid,
							PN.ImageLink img,
							''partner'' tags,
							PN.RootPersonId,
							PN.RootBranchId,
							PN.Level,
							CASE 
								WHEN PN.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(PN.Phone,'''') Phone
					FROM dbo.RootPerson PN
					INNER JOIN(
						SELECT *
						FROM #tmpRRR3
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T ON T.PartnerPersonId = PN.RootPersonId

					UNION
					SELECT Child.RootPersonId id,
							Child.Name name,
							T1.id pid,
							Child.ImageLink img,
							'''' tags,
							Child.RootPersonId,
							Child.RootBranchId,
							Child.Level,
							CASE 
								WHEN Child.Sex = 1 THEN N''Nam'' ELSE N''Nữ''
							END Sex,
							ISNULL(Child.Phone,'''') Phone
					FROM dbo.RootPerson Child
					INNER JOIN (
						SELECT * 
						FROM #tmpRRR3
						WHERE 1=1  AND Level IN '+@w_Level+N' 
						AND RootBranchId = ' + CAST(@BranchId AS VARCHAR(10)) + N'
					) T1 ON T1.id = Child.MotherRootPersonId
				) A 
		END		'
	
	EXEC (@query)
	SELECT(@query)
END