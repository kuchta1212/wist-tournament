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

        public Dictionary<string, GamePoints> GetResult()
        {
            var dict = new Dictionary<string, GamePoints>();
            foreach(var player in this.Players)
            {
                var rank = this.Players.IndexOf(player);
                dict.Add(player.Id, new GamePoints() { Rank = rank, PartialResults = new Dictionary<int, int>()});
            }

            var rounds = this.Rounds.Where(r => r.Status == RoundStatus.Done);
            foreach (var round in rounds)
            { 
                foreach(var bet in round.Bets)
                {
                    dict[bet.Player.Id].Points += bet.GetResult();
                    dict[bet.Player.Id].AmountOfDecks += bet.Tip;
                    if (!dict[bet.Player.Id].PartialResults.ContainsKey(round.AmountOfCards))
                    {
                        dict[bet.Player.Id].PartialResults.Add(round.AmountOfCards, 0);
                    }

                    dict[bet.Player.Id].PartialResults[round.AmountOfCards] += bet.GetResult();
                }
            }

            return dict;
        }

        public int GetPlace(string playerId)
        {
            var result = this.GetResult();
            var ordered = result.OrderBy(r => r.Value);
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
