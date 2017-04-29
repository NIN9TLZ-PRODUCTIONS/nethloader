using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace nethloader.Data.Migrations
{
    public partial class RemoveFullName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FullName",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "AspNetUsers",
                nullable: true);
        }
    }
}
