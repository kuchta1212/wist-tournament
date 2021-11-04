using Microsoft.EntityFrameworkCore.Migrations;

namespace Wist.Migrations
{
    public partial class Statuses_Bet_Game_Round : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDone",
                table: "Rounds");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Rounds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Bets",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Rounds");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Bets");

            migrationBuilder.AddColumn<bool>(
                name: "IsDone",
                table: "Rounds",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
