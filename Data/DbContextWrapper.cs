namespace Wist.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;
    using Microsoft.EntityFrameworkCore;
    using Wist.Utils;

    public class DbContextWrapper : IDbContextWrapper
    {
        private readonly WistDbContext dbContext;
        private readonly IModelFactory modelFactory;

        public DbContextWrapper(WistDbContext dbContext, IModelFactory modelFactory)
        {
            this.dbContext = dbContext;
            this.modelFactory = modelFactory;
        }

        public void CreateGame(List<string> participantsIds, GameType type, string tournamentId)
        {
            var paticipants = this.GetParticipants(participantsIds);
            var amountOfGames = this.GetAllTournamentGames(tournamentId).Count;
            var game = this.modelFactory.CreateGame(type, paticipants, amountOfGames);

            this.dbContext.Games.Add(game);
            this.dbContext.SaveChanges();
        }

        public Tournament CreateTournament(string name, List<string> usersIds)
        {
            var users = this.GetUsers(usersIds);
            var particiapants = users.Select(u => new Participant() { User = u, TournamentPoints = new TournamentPoints() }).ToList();
            var tournament = new Tournament()
            {
                Name = name,
                Date = DateTime.Today.Date,
                Participants = particiapants
            };

            var tournamentRecord = this.dbContext.Tournaments.Add(tournament);
            this.dbContext.SaveChanges();

            return tournamentRecord.Entity;
        }

        public void DeleteTournament(string tournamentId)
        {
            var tournament = this.GetTournament(tournamentId);

            this.DeleteParticipants(tournament.Participants);
            this.DeleteGames(tournament.Games);

            this.dbContext.Tournaments.Remove(tournament);

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
            => this.dbContext.WistUsers.OrderByDescending(u => u.Points).ToList();

        public void SetRoundBetsResult(Dictionary<string, bool> betsResults, string roundId)
        {
            var round = this.GetRound(roundId);
            foreach(var bet in round.Bets)
            {
                bet.IsSuccess = betsResults[bet.Id];
                bet.Status = BetStatus.WithResult;
            }
            round.Status = RoundStatus.Done;

            this.dbContext.Update(round);
            this.dbContext.SaveChanges();
        }

        public void SetRoundBets(Dictionary<string, int> playerTips, string roundId)
        {
            var round = this.GetRound(roundId);
            var players = this.GetPlayers(playerTips.Keys.ToList());
            if(round.Bets.Count == 0)
            {
                round.Bets = this.modelFactory.CreateBets(players, playerTips);
            }
            else
            {
                foreach(var bet in round.Bets)
                {
                    bet.Tip = playerTips[bet.Player.Id];
                }
            }

            round.Status = RoundStatus.BetsAreSet;
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

            game.Status = GameStatus.Started;

            this.dbContext.Update(game);
            this.dbContext.SaveChanges();
        }

        public void UpdateTournament(Tournament tournament)
        {
            this.dbContext.Update(tournament);
            this.dbContext.SaveChanges();
        }

        public List<Tournament> GetTournaments()
            => this.dbContext.Tournaments
            .Include(t => t.Participants)
                .ThenInclude(p => p.User)
            .Include(t => t.Participants)
                .ThenInclude(p => p.TournamentPoints)
            .ToList();

        public Tournament GetTournament(string tournamentId)
            => this.dbContext.Tournaments
            .Include(t => t.Participants)
                .ThenInclude(p => p.User)
            .Include(t => t.Participants)
                .ThenInclude(p => p.TournamentPoints)
            .Include(t => t.Games)
                .ThenInclude(g => g.Rounds)
                    .ThenInclude(r => r.Bets)
            .Include(t => t.Games)
                .ThenInclude(g => g.Players)
                    .ThenInclude(p => p.Participant)
                        .ThenInclude(p => p.User)
            .First(t => t.Id == tournamentId);

        public void SetParticipantAsLeft(string tournamentId, string participantId)
        {
            this.dbContext.Tournaments
                 .Include(t => t.Participants)
                 .First(t => t.Id == tournamentId).Participants.First(p => p.Id == participantId).Left = true;

            this.dbContext.SaveChanges();
        }

        public void AddParticipant(string tournamentId, string userId)
        {
            if (this.dbContext.Tournaments
                .Include(t => t.Participants)
                    .ThenInclude(p => p.User)
                .First(t => t.Id == tournamentId).Participants.Where(p => p.User.Id == userId).Count() > 0)
            {
                return;
            }

            var user = this.GetUser(userId);
            var participant = new Participant() { User = user, TournamentPoints = new TournamentPoints() };

            this.dbContext.Tournaments.First(t => t.Id == tournamentId).Participants.Add(participant);
            this.dbContext.SaveChanges();
        }

        public Game GetGame(string gameId)
        { 
            var game = this.dbContext.Games
            .Include(g => g.Players)
                .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.User)
            .Include(g => g.Players)
                .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.TournamentPoints)
            .Include(g => g.Rounds)
                .ThenInclude(r => r.Bets)
            .FirstOrDefault(r => r.Id == gameId); 

            return game;
        }

        public Round GetRound(string roundId)
            => this.dbContext.Rounds
            .Include(r => r.Bets)
                .ThenInclude(b => b.Player)
                    .ThenInclude(p => p.Participant)
                        .ThenInclude(p => p.User)
            .FirstOrDefault(r => r.Id == roundId);

        public List<Participant> GetTournamentParticipants(string tournamentId)
            => this.dbContext.Tournaments
            .Include(t => t.Participants)
                .ThenInclude(p => p.User)
            .Include(t => t.Participants)
                .ThenInclude(p => p.TournamentPoints)
            .First(t => t.Id == tournamentId)?.Participants.ToList();


        public List<Game> GetTournamentGamesForType(string tournamentId, GameType gameType)
            => this.dbContext.Tournaments
            .Include(t => t.Games)
                .ThenInclude(g => g.Rounds)
            .Include(t => t.Games)
                .ThenInclude(g => g.Players)
                    .ThenInclude(p => p.Participant)
                        .ThenInclude(p => p.User)
            .First(t => t.Id == tournamentId)?.Games.Where(g => g.Type == gameType).ToList();

        public List<Game> GetAllTournamentGames(string tournamentId)
            => this.dbContext.Tournaments
                .Include(t => t.Games)
                    .ThenInclude(g => g.Rounds)
                .Include(t => t.Games)
                    .ThenInclude(g => g.Players)
                        .ThenInclude(p => p.Participant)
                            .ThenInclude(p => p.User)
                .First(t => t.Id == tournamentId)?.Games.ToList();

        public void AddGamesIntoTournament(string tournamentId, List<Game> games)
        {
            this.dbContext.Tournaments.First(t => t.Id == tournamentId)?.Games.AddRange(games);
            this.dbContext.SaveChanges();
        }

        public void RemoveRoundOfGames(string tournamentId, GameType gameType)
        {
            var games = this.GetTournamentGamesForType(tournamentId, gameType);
            this.dbContext.Games.RemoveRange(games);
            this.dbContext.SaveChanges();
        }

        public List<Game> GetActiveTournamentGames(string tournamentId)
         => this.dbContext.Tournaments
                .Include(t => t.Games)
                    .ThenInclude(g => g.Rounds)
                        .ThenInclude(r => r.Bets)
                            .ThenInclude(b => b.Player)
                .Include(t => t.Games)
                    .ThenInclude(g => g.Players)
                        .ThenInclude(p => p.Participant)
                            .ThenInclude(p => p.User)
                .First(t => t.Id == tournamentId)?.Games
            .Where(g => g.Status == GameStatus.Started).ToList();

        public void UpdateGame(Game game)
        {
            this.dbContext.Update(game);
            this.dbContext.SaveChanges();
        }

        public Dictionary<string, List<int>> GetParticipantPoints(string gameId, List<string> participantIds)
        {
            var tournamentId = this.dbContext.Tournaments.First(t => t.Games.Any(g => g.Id == gameId)).Id;

            var games = this.dbContext.Tournaments
                .Include(t => t.Games)
                    .ThenInclude(g => g.Rounds)
                        .ThenInclude(r => r.Bets)
                .Include(t => t.Games)
                    .ThenInclude(g => g.Players)
                        .ThenInclude(p => p.Participant)
                .First(t => t.Id == tournamentId).Games
                .Where(g => g.Players.Select(p => p.Participant.Id).Any(pId => participantIds.Contains(pId)));

            var participantPoints = new Dictionary<string, List<int>>();

            foreach(var game in games)
            {
                var gameResult = game.GetResult();
                foreach(var participantId in participantIds)
                {
                    var playerId = game.Players.FirstOrDefault(p => p.Participant.Id == participantId)?.Id;
                    if(!string.IsNullOrEmpty(playerId))
                    {
                        if(!participantPoints.ContainsKey(participantId))
                        {
                            participantPoints.Add(participantId, new List<int>());
                        }

                        participantPoints[participantId].Add(gameResult[playerId].Points);
                    }
                }
            }
 
            return participantPoints;
        } 


        private void DeleteParticipants(List<Participant> participants)
        {
            foreach(var participant in participants)
            {
                this.dbContext.Remove(participant.TournamentPoints);
                this.dbContext.Remove(participant);
            }
        }

        private void DeleteGames(List<Game> games)
        {
            foreach(var game in games)
            {
                this.DeleteRounds(game.Rounds);
                this.DeletePlayers(game.Players);
                this.dbContext.Remove(game);
            }
        }

        private void DeleteRounds(List<Round> rounds)
        {
            foreach(var round in rounds)
            {
                this.DeleteBets(round.Bets);
                this.dbContext.Remove(round);
            }
        }

        private void DeleteBets(List<Bet> bets)
        {
            foreach(var bet in bets)
            {
                this.dbContext.Remove(bet);
            }
        }

        private void DeletePlayers(List<Player> players)
        {
            foreach(var player in players)
            {
                this.dbContext.Remove(player);
            }
        }

        private List<Participant> GetParticipants(List<string> ids) 
            => this.dbContext.Participants
            .Include(p => p.User)
            .Include(p => p.TournamentPoints)
            .Where(p => ids.Contains(p.Id)).ToList();

        private List<User> GetUsers(List<string> ids)
            => this.dbContext.WistUsers.Where(u => ids.Contains(u.Id)).ToList();

        private List<Bet> GetBets(string roundId)
            => this.GetRound(roundId).Bets;

        private List<Player> GetPlayers(List<string> ids)
            => this.dbContext.Players
            .Include(p => p.Participant)
            .Where(u => ids.Contains(u.Id)).ToList();

        private User GetUser(string userId)
            => this.dbContext.WistUsers.FirstOrDefault(u => u.Id == userId);
    }
}
