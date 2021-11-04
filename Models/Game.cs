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

        public GameType Type { get; set; }

        public GameStatus Status { get; set; }

        public Dictionary<string, int> GetResult()
        {
            var dict = new Dictionary<string, int>();
            foreach(var player in this.Players)
            {
                dict.Add(player.Id, 0);
            }

            var rounds = this.Rounds.Where(r => r.Status == RoundStatus.Done);
            foreach (var round in rounds)
            { 
                foreach(var bet in round.Bets)
                {
                    dict[bet.Player.Id] += bet.GetResult();
                }
            }

            return dict;
        }

        public Player GetDealer(Round round)
        {
            var mod = round.RoundNumber % 4;
            if(mod == 0)
            {
                mod = 4;
            }

            return this.Players.First(p => p.GameRank == mod);
        }

        public int GetRank(string playerId)
        {
            var result = this.GetResult();
            var ordered = result.OrderByDescending(r => r.Value);
            var rank = 1;
            foreach(var order in ordered)
            {
                if(order.Key == playerId)
                {
                    break;                    
                }
                rank++;
            }
            return rank;
        }
    }
}
