using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ReportApp
{
    public partial class ViewReport : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Label1.Text = GetReportAttr("ReportName");
            Label2.Text = GetReportAttr("ReportDesc");
            string reportserver = GetReportAttr("ReportURL");
            string reportpath = GetReportAttr("ReportPath");

            System.Uri uri = new System.Uri(reportserver);
            ReportViewer1.ServerReport.ReportServerUrl = uri;
            ReportViewer1.ServerReport.ReportPath = reportpath;
        }
                   

        public string GetReportID()
        {
            string id = Request.QueryString["id"];

            return id;
        }

        public string GetReportAttr(string field)
        {
            string val = null;

            DataTable dt = new DataTable();
            SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            connection.Open();
            SqlCommand sqlCmd = new SqlCommand("SELECT ReportName, ReportDesc, ReportURL, ReportPath FROM ReportContents WHERE ID = @id", connection);

            SqlDataAdapter sqlDa = new SqlDataAdapter(sqlCmd);

            sqlCmd.Parameters.AddWithValue("@id", GetReportID());
            sqlDa.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                val = dt.Rows[0][field].ToString();
            }
            connection.Close();

            return val;
        }
    }
}