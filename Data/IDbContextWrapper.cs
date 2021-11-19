namespace Wist.Data
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

        void SetRoundBets(Dictionary<string, int> participantsTips, string roundId);

        void SetRoundBetsResult(Dictionary<string, bool> participantsResult, string roundId);

        void SetGameOrder(Dictionary<string, int> playersOrder, string gameId);

        void DeleteTournament(string tournamentId);

        void SetParticipantAsLeft(string tournamentId, string participantId);

        void AddParticipant(string tournamentId, string userId);

        Game GetGame(string gameId);

        Round GetRound(string roundId);

        List<Participant> GetTournamentParticipants(string tournamentId);

        List<Game> GetTournamentGamesForType(string tournamentId, GameType gameType);

        List<Game> GetAllTournamentGames(string tournamentId);

        void AddGamesIntoTournament(string tournamentId, List<Game> games);

        void RemoveRoundOfGames(string tournamentId, GameType gameType);

        List<string> GetActiveTournamentGames(string tournamentId);

        void UpdateGame(Game game);

        Dictionary<string, List<int>> GetParticipantPoints(string gameId, List<string> participantIds);
    }
}
