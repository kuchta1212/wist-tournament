namespace Wist.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public class GameCalculator : IGameCalculator
    {
        public int GetPlace(string playerId, Game game)
        {
            var result = this.GetResult(game);
            var ordered = result.OrderBy(r => r.Value);
            var rank = 1;
            foreach (var order in ordered)
            {
                if (order.Key == playerId)
                {
                    break;
                }
                rank++;
            }
            return rank;
        }

        public Dictionary<string, int> GetPlaces(Dictionary<string, GamePoints> gameResults)
        {
            var result = new Dictionary<string, int>();
            var ordered = gameResults.OrderBy(r => r.Value);
            foreach (var playerId in gameResults.Keys)
            {
                var rank = 1;
                foreach (var order in ordered)
                {
                    if (order.Key == playerId)
                    {
                        break;
                    }
                    rank++;
                }
                result.Add(playerId, rank);
            }

            return result;

        }

        public Dictionary<string, GamePoints> GetResult(Game game)
        {
            var dict = new Dictionary<string, GamePoints>();
            foreach (var player in game.Players)
            {
                var rank = game.Players.IndexOf(player);
                dict.Add(player.Id, new GamePoints() { Rank = rank, PartialResults = new Dictionary<int, int>() });
            }

            var rounds = game.Rounds.Where(r => r.Status == RoundStatus.Done);
            foreach (var round in rounds)
            {
                foreach (var bet in round.Bets)
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

    }
}
