﻿namespace Wist.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public interface IDbContextWrapper
    {
        void CreateUser(string name);

        List<User> GetUsers();

        Tournament CreateTournament(string name, List<string> usersIds);

        void UpdateTournament(Tournament tournament);

        List<Tournament> GetTournaments();

        Tournament GetTournament(string tournamentId);

        void CreateGame(List<string> participantsIds, GameType type, string tournamentId);

        void SetRoundTips(Dictionary<string, int> participantsTips, string roundId);

        void SetRoundTipsResult(Dictionary<string, bool> participantsResult, string roundId);

        void SetGameOrder(Dictionary<string, int> playersOrder, string gameId);

        void DeleteTournament(string tournamentId);

        void SetParticipantAsLeft(string tournamentId, string participantId);

        void AddParticipant(string tournamentId, string userId);
    }
}
