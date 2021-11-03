﻿namespace Wist.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;
    using Microsoft.EntityFrameworkCore;

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
            var amountOfGames = this.GetGames(tournamentId).Count;
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
            var tournament = this.dbContext.Tournaments.First(t => t.Id == tournamentId);
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
            }
            round.IsDone = true;

            this.dbContext.Update(round);
            this.dbContext.SaveChanges();
        }

        public void SetRoundBets(Dictionary<string, int> playerTips, string roundId)
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
            .Include(t => t.Games)
            .ThenInclude(g => g.Rounds)
            .Include(t => t.Games)
            .ThenInclude(g => g.Players)
            .ThenInclude(p => p.Participant)
            .ThenInclude(p => p.User)
            .First(t => t.Id == tournamentId);

        public void SetParticipantAsLeft(string tournamentId, string participantId)
        {
            var tournament = this.GetTournament(tournamentId);
            var participant = tournament.Participants.First(p => p.Id == participantId);
            participant.Left = true;

            this.dbContext.Update(participant);
            this.dbContext.SaveChanges();
        }

        public void AddParticipant(string tournamentId, string userId)
        {
            var tournament = this.GetTournament(tournamentId);
            var user = this.GetUser(userId);

            tournament.Participants.Add(new Participant() { User = user });
            
            this.dbContext.Update(tournament);
            this.dbContext.SaveChanges();
        }

        public Game GetGame(string gameId)
            => this.dbContext.Games
            .Include(g => g.Players)
                .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.User)
            .Include(g => g.Rounds)
                .ThenInclude(r => r.Bets)
            .FirstOrDefault(r => r.Id == gameId);

        public Round GetRound(string roundId)
            => this.dbContext.Rounds
            .Include(r => r.Bets)
                .ThenInclude(b => b.Player)
                    .ThenInclude(p => p.Participant)
                        .ThenInclude(p => p.User)
            .FirstOrDefault(r => r.Id == roundId);

        private List<Participant> GetParticipants(List<string> ids) 
            => this.dbContext.Participants
            .Include(p => p.User)
            .Include(p => p.TournamentPoints)
            .Where(p => ids.Contains(p.Id)).ToList();

        private List<Game> GetGames(string tournamentId)
            => this.dbContext.Games
            .Include(g => g.Players)
            .Include(g => g.Rounds)
            .ToList();

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
