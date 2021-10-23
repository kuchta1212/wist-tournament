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

        void CreateTournament(string name, List<string> usersIds);

        List<Tournament> GetTournaments();

        Tournament GetTournament(string tournamentId);

        void CreateGame(List<string> participantsIds, bool isFinal, string tournamentId);

        void SetRoundTips(Dictionary<string, int> participantsTips, string roundId);

        void SetRoundTipsResult(Dictionary<string, bool> participantsResult, string roundId);

        void SetGameOrder(Dictionary<string, int> playersOrder, string gameId);
    }
}
