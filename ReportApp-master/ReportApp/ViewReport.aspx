<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ViewReport.aspx.cs" Inherits="ReportApp.ViewReport" %>
<%@ Register assembly="Microsoft.ReportViewer.WebForms, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" namespace="Microsoft.Reporting.WebForms" tagprefix="rsweb" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    <br />
    <br />
    <br />
    <br />
    <h1><asp:Label ID="Label1" runat="server" Text=""></asp:Label></h1>
    <h4><asp:Label ID="Label2" runat="server" Text=""></asp:Label></h4>    
    <br />
        <rsweb:ReportViewer ID="ReportViewer1" runat="server" ProcessingMode="Remote" Width="100%" Height="800px">
        </rsweb:ReportViewer>
</asp:Content>
