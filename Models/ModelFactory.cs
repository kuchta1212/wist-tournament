namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ModelFactory : IModelFactory
    {
        public List<Bet> CreateBets(List<Player> players, Dictionary<string, int> playersTips)
        {
            var bets = new List<Bet>();
            foreach(var player in players)
            {
                var bet = new Bet()
                {
                    IsSuccess = false,
                    Player = player,
                    Tip = playersTips[player.Id],
                    Status = BetStatus.Set
                };

                bets.Add(bet);
            }

            return bets;
        }

        public Game CreateGame(GameType type, List<Participant> participants, int amountOfGamesInTournament)
        {
            var rounds = this.CreateRounds();

            return new Game()
            {
                Type = type,
                Name = "Stůl-" + ++amountOfGamesInTournament,
                Players = participants.Select(p => new Player() { Participant = p }).ToList(),
                Rounds = rounds,
                Status = GameStatus.NotStarted
            };
        }

        private List<Round> CreateRounds()
        {
            var rounds = new List<Round>();
            var amountOfCards = 8;
            var goingDown = true;
            for (var i = 0; i < 16; i++)
            {
                var round = new Round()
                {
                    AmountOfCards = amountOfCards,
                    Status = RoundStatus.NotStarted,
                    RoundNumber = i+1,
                    DealerNumber = (i % 4) + 1
                };

                rounds.Add(round);

                if(amountOfCards > 1 && goingDown)
                {
                    amountOfCards--;
                } 
                else if(amountOfCards > 1 && !goingDown)
                {
                    amountOfCards++;
                }
                else if(amountOfCards == 1 && goingDown)
                {
                    goingDown = false;
                }
                else if(amountOfCards == 1 && !goingDown)
                {
                    amountOfCards++;
                }
            }

            return rounds;
        }
    }
}
