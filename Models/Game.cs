namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Game
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public string Name { get; set; }

        public List<Player> Players { get; set; }

        public List<Round> Rounds { get; set; }

        public bool IsFinal { get; set; }

        public Player GetDealer(Round round)
        {
            var mod = round.RoundNumber % 4;
            if(mod == 0)
            {
                mod = 4;
            }

            return this.Players.First(p => p.GameRank == mod);
        }
    }
}
