namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Round
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public int RoundNumber { get; set; }

        public int DealerNumber { get; set; }

        public int AmountOfCards { get; set; }

        public List<Bet> Bets { get; set; }

        public bool IsDone { get; set; }
    }
}
