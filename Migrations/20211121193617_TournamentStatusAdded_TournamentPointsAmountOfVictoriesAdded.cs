using Microsoft.EntityFrameworkCore.Migrations;

namespace Wist.Migrations
{
    public partial class TournamentStatusAdded_TournamentPointsAmountOfVictoriesAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Tournaments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AmountOfVictories",
                table: "TournamentPoints",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "AmountOfVictories",
                table: "TournamentPoints");
        }
    }
}
