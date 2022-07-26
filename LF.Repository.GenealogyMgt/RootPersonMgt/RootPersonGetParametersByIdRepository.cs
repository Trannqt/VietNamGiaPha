using ConnectDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RootPersonGetParametersByIdRepository: Query
    {
        public long PersonId { get; set; }
        public long SsBranchId { get; set; }
        public List<dynamic> Execute()
        {
            using (var cmd = new Query())
            {
                cmd.QueryString = @" SELECT   SSTemp2.RootBranchId ,
				             SSTemp2.RootPersonId ,
				             SSTemp2.Level ,
				             SSTemp3.maxLevel
			            FROM    ( 
					            SELECT    *
					            FROM      dbo.RootPerson
					            WHERE     RootPersonId = @PersonId
			            ) SSTemp1
			            INNER JOIN ( SELECT *
						             FROM   dbo.RootPerson
						             WHERE  RootBranchId = @SsBranchId 
					               ) SSTemp2 ON SSTemp2.RootPersonId = SSTemp1.FatherRootPersonId
							              OR SSTemp2.RootPersonId = SSTemp1.MotherRootPersonId
			            LEFT JOIN ( SELECT  SSTemp3.RootBranchId ,
								            MAX(SSTemp3.Level) maxLevel
						            FROM    RootPerson SSTemp3
						            WHERE   SSTemp3.RootBranchId = @SsBranchId 
						            GROUP BY SSTemp3.RootBranchId
					              ) SSTemp3 ON SSTemp3.RootBranchId = SSTemp2.RootBranchId";

                cmd.Parameters = new
                {
                    PersonId = PersonId,
                    SsBranchId = SsBranchId,
                };
                return cmd.ExecuteQuery();
            }
        }
    }
}
