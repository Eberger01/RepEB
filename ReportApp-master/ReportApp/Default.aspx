<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ReportApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <br />
    <br />
    <br />
    <br />
    <h1>Section 1</h1>
    <h4>Lorem ipsum dolor sit amet, an congue mediocrem quo. Ne debet nonumy offendit vis. Sale error vulputate vim in, at usu aperiri impedit. Vim putent forensibus id. Quas numquam lobortis id est, et vel debet mediocrem tincidunt. Lorem referrentur id usu.</h4>
    <div class="grid-container">
        <asp:Repeater ID="rptrReports1" runat="server">
            <ItemTemplate>
                <div class="panel panel-info">
                    <div class="panel-heading"><a href="ViewReport?id=<%# Eval("ID") %>"><%# Eval("ReportName")%></a></div>
                    <div class="panel-body"><%# Eval("ReportDesc")%></div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
    <h1>Section 2</h1>
    <h4>Lorem ipsum dolor sit amet, an congue mediocrem quo. Ne debet nonumy offendit vis. Sale error vulputate vim in, at usu aperiri impedit. Vim putent forensibus id. Quas numquam lobortis id est, et vel debet mediocrem tincidunt. Lorem referrentur id usu.</h4>
    <div class="grid-container">
        <asp:Repeater ID="rptrReports2" runat="server">
            <ItemTemplate>
                <div class="panel panel-success">
                    <div class="panel-heading"><a href="ViewReport?id=<%# Eval("ID") %>"><%# Eval("ReportName")%></a></div>
                    <div class="panel-body"><%# Eval("ReportDesc")%></div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
    <h1>Section 3</h1>
    <h4>Lorem ipsum dolor sit amet, an congue mediocrem quo. Ne debet nonumy offendit vis. Sale error vulputate vim in, at usu aperiri impedit. Vim putent forensibus id. Quas numquam lobortis id est, et vel debet mediocrem tincidunt. Lorem referrentur id usu.</h4>
    <div class="grid-container">
        <asp:Repeater ID="rptrReports3" runat="server">
            <ItemTemplate>
                <div class="panel panel-warning">
                    <div class="panel-heading"><a href="ViewReport?id=<%# Eval("ID") %>"><%# Eval("ReportName")%></a></div>
                    <div class="panel-body"><%# Eval("ReportDesc")%></div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
</asp:Content>
