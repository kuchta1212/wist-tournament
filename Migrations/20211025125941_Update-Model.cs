using Microsoft.EntityFrameworkCore.Migrations;

namespace Wist.Migrations
{
    public partial class UpdateModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TournamentPoints",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "IsFinal",
                table: "Games");

            migrationBuilder.AddColumn<string>(
                name: "TournamentPointsId",
                table: "Participants",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TournamentPoints",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AvaragePlace = table.Column<double>(type: "float", nullable: false),
                    PointMedian = table.Column<int>(type: "int", nullable: false),
                    PointAvg = table.Column<double>(type: "float", nullable: false),
                    TotalPoints = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentPoints", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Participants_TournamentPointsId",
                table: "Participants",
                column: "TournamentPointsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Participants_TournamentPoints_TournamentPointsId",
                table: "Participants",
                column: "TournamentPointsId",
                principalTable: "TournamentPoints",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Participants_TournamentPoints_TournamentPointsId",
                table: "Participants");

            migrationBuilder.DropTable(
                name: "TournamentPoints");

            migrationBuilder.DropIndex(
                name: "IX_Participants_TournamentPointsId",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "TournamentPointsId",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Games");

            migrationBuilder.AddColumn<int>(
                name: "TournamentPoints",
                table: "Participants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsFinal",
                table: "Games",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
