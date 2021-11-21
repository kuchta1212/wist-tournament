namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Tournament
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string Name { get; set; }

        public DateTime Date { get; set; }

        public List<Participant> Participants { get; set; }

        public List<Game> Games { get; set; }

        public TournamentStatus Status { get; set; }

        public TournamentLite ToLiteMode()
        {
            return new TournamentLite()
            {
                Id = this.Id,
                Name = this.Name,
                Date = this.Date.ToString("dd.MM yyyy"),
                Winners = this.Participants.OrderBy(p => p.TournamentPoints).Take(3).ToList(),
                Status = this.Status
            };
        }
    }
}
