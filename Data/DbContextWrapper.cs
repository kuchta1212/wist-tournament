namespace Wist.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public class DbContextWrapper : IDbContextWrapper
    {
        private readonly WistDbContext dbContext;
        private readonly IModelFactory modelFactory;

        public DbContextWrapper(WistDbContext dbContext, IModelFactory modelFactory)
        {
            this.dbContext = dbContext;
            this.modelFactory = modelFactory;
        }

        public void CreateGame(List<string> participantsIds, bool isFinal, string tournamentId)
        {
            var paticipants = this.GetParticipants(participantsIds);
            var amountOfGames = this.GetGames(tournamentId).Count;
            var game = this.modelFactory.CreateGame(isFinal, paticipants, amountOfGames);

            this.dbContext.Games.Add(game);
            this.dbContext.SaveChanges();
        }

        public void CreateTournament(string name, List<string> usersIds)
        {
            var users = this.GetUsers(usersIds);
            var particiapants = users.Select(u => new Participant() { User = u, TournamentPoints = 0 }).ToList();
            var tournament = new Tournament()
            {
                Name = name,
                Date = DateTime.Today.Date,
                Participants = particiapants
            };

            this.dbContext.Tournaments.Add(tournament);
            this.dbContext.SaveChanges();
        }

        public void CreateUser(string name)
        {
            var user = new User()
            {
                Name = name,
                Points = 0
            };

            this.dbContext.WistUsers.Add(user);
            this.dbContext.SaveChanges();
        }

        public List<User> GetUsers()
            => this.dbContext.WistUsers.ToList();

        public void SetRoundTipsResult(Dictionary<string, bool> participantsResult, string roundId)
        {
            var round = this.GetRound(roundId);
            var bets = this.GetBets(roundId);
            round.Bets = bets;

            this.dbContext.Update(round);
            this.dbContext.SaveChanges();
        }

        public void SetRoundTips(Dictionary<string, int> playerTips, string roundId)
        {
            var round = this.GetRound(roundId);
            var players = this.GetPlayers(playerTips.Keys.ToList());
            var bets = this.modelFactory.CreateBets(players, playerTips);
            round.Bets = bets;

            this.dbContext.Update(round);
            this.dbContext.SaveChanges();
        }

        public void SetGameOrder(Dictionary<string, int> playersOrder, string gameId)
        {
            var game = this.GetGame(gameId);

            foreach(var player in game.Players)
            {
                player.GameRank = playersOrder[player.Id];
            }

            this.dbContext.Update(game);
            this.dbContext.SaveChanges();
        }

        public List<Tournament> GetTournaments()
            => this.dbContext.Tournaments.ToList();

        public Tournament GetTournament(string tournamentId)
            => this.dbContext.Tournaments.First(t => t.Id == tournamentId);


        private List<Participant> GetParticipants(List<string> ids) 
            => this.dbContext.Participants.Where(p => ids.Contains(p.Id)).ToList();

        private List<Game> GetGames(string tournamentId)
            => this.dbContext.Games.ToList();

        private List<User> GetUsers(List<string> ids)
            => this.dbContext.WistUsers.Where(u => ids.Contains(u.Id)).ToList();

        private Round GetRound(string roundId)
            => this.dbContext.Rounds.FirstOrDefault(r => r.Id == roundId);

        private List<Bet> GetBets(string roundId)
            => this.GetRound(roundId).Bets;

        private Game GetGame(string gameId)
            => this.dbContext.Games.FirstOrDefault(r => r.Id == gameId);

        private List<Player> GetPlayers(List<string> ids)
            => this.dbContext.Players.Where(u => ids.Contains(u.Id)).ToList();
    }
}
