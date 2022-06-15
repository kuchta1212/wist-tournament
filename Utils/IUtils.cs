namespace Wist.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public interface IUtils
    {
        List<List<Participant>> GenerateInitialParticipantGroups(List<Participant> participants);

        List<List<Participant>> GetInitialParticipantGroups(List<Participant> participants, List<List<string>> tables);

        List<List<Participant>> GenerateParticipantGroups(List<Participant> participants, List<Game> games);

        List<List<Participant>> GenerateFinalParticipantGroups(List<Participant> participants);

        void RecalculateTournamentPoints(Game game, Dictionary<string, List<PlayerResult>> participantPoints);

        void RecalculateTotalTournamentPoints(List<Game> finalRound);
    }
}
