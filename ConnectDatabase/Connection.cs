using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectDatabase
{
    public abstract class Connection: IDisposable       
    {
        protected string ConnectionString { get; }
        public Connection()
        {
            this.ConnectionString = @"Data Source=DESKTOP-EM0OAS0;Initial Catalog=VietNamGiaPha;Integrated Security=True";
        }

        public void Dispose()
        {
        }
    }
}
