namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public interface IModelFactory
    {
        Game CreateGame(GameType type, List<Participant> participants, int amountOfGamesInTournament);

        List<Bet> CreateBets(List<Player> players, Dictionary<string, int> participantsResult);
    }
}
