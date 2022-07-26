using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace ConnectDatabase
{
    public class Query: Connection
    {
        public string QueryString { get; set; }
        public object Parameters { get; set; } = null;
        public List<dynamic> ExecuteQuery()
        {
            try
            {
                using (var conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    DataTable data = new DataTable();
                    var result = new List<dynamic>();
                    var reader = conn.ExecuteReader(QueryString, Parameters);
                    var schemaTable = reader.GetSchemaTable();
                    var column = new List<dynamic>();
                    foreach (DataRow row in schemaTable.Rows)
                    {
                        string colName = row.Field<string>("ColumnName");
                        Type t = row.Field<Type>("DataType");
                        data.Columns.Add(colName, t);

                    }
                    while (reader.Read())
                    {
                        //var dyn = new ExpandoObject();
                        //var ar = (IDictionary<string, Object>)dyn;
                        Dictionary<string, Object> ar = new Dictionary<string, object>();
                        foreach (DataColumn col in data.Columns)
                        {
                            ar[col.ColumnName] = reader[col.ColumnName];
                        }
                        result.Add(ar);
                    }
                    reader.Close();
                    conn.Close();
                    return result;
                }
            }
            catch(Exception ex)
            {
                return new List<dynamic> { new { Error = ex.Message } };
            }
        }

        public bool ExecuteQueryNonReader()
        {
            try
            {
                using (var conn = new SqlConnection(ConnectionString))
                {
                    DataTable data = new DataTable();
                    var result = new List<dynamic>();
                    using (var cmd = conn.CreateCommand())
                    {
                        conn.Open();
                        cmd.CommandText = this.QueryString;
                        return Convert.ToBoolean(cmd.ExecuteNonQuery());
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
