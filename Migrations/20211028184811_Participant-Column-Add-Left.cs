using Microsoft.EntityFrameworkCore.Migrations;

namespace Wist.Migrations
{
    public partial class ParticipantColumnAddLeft : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Left",
                table: "Participants",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Left",
                table: "Participants");
        }
    }
}
