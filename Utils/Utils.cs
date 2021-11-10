namespace Wist.Utils
{
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public class Utils : IUtils
    {
        private readonly Random random;
        private readonly IOptions<WinnerPointsOptions> winnerPointOptions;

        public Utils(IOptions<WinnerPointsOptions> winnerPointOptions)
        {
            this.random = new Random();
            this.winnerPointOptions = winnerPointOptions;
        }

        public List<List<Participant>> GenerateFinalParticipantGroups(List<Participant> participants)
        {
            var result = new List<List<Participant>>();
            var max = participants.Count / 4;

            var ordered = participants.Where(p => !p.Left).OrderByDescending(p => p.TournamentPoints);
            for(var i = 0; i < max; i++)
            {
                var list = ordered.Skip(i * 4).Take(4).ToList();
                result.Add(list);
            }

            return result;
        }

        public List<List<Participant>> GenerateParticipantGroups(List<Participant> participants, List<Game> games)
        {
            var playingParticipants = participants.Where(p => !p.Left).ToList();
            var amountOfGroups = playingParticipants.Count / 4;
            var mustBe = this.GetMustBe(playingParticipants, games);
            return this.GenerateParticipantGroupsCore(playingParticipants, mustBe, amountOfGroups);
        }

        public List<List<Participant>> GenerateInitialParticipantGroups(List<Participant> participants)
        {
            var playingParticipants = participants.Where(p => !p.Left).ToList();
            var amountOfGroups = playingParticipants.Count / 4;
            var preSelected = playingParticipants.OrderByDescending(p => p.User.Points).Take(amountOfGroups).ToList();
            return this.GenerateParticipantGroupsCore(playingParticipants, preSelected, amountOfGroups);
        }

        public List<List<Participant>> GenerateParticipantGroupsCore(List<Participant> participants, List<Participant> preSelected, int amountOfGroups)
        {
            var nonSelectedIndexes = new List<int>();
            for (var j = preSelected.Count; j < participants.Count; j++)
            {
                nonSelectedIndexes.Add(j);
            }

            var groups = new List<List<Participant>>();
            for (var i = 0; i < amountOfGroups; i++)
            {
                var group = new List<Participant>
                {
                    preSelected[i]
                };
                for (var m = 0; m < 3; m++)
                {
                    var index = this.GetRandomIndex(nonSelectedIndexes);
                    group.Add(participants[index]);
                }
                groups.Add(group);
            }

            return groups;
        }

        private int GetRandomIndex(List<int> nonSelectedIndexes)
        {
            var index = this.random.Next(nonSelectedIndexes.Count);
            var selectedIndex = nonSelectedIndexes[index];
            nonSelectedIndexes.Remove(selectedIndex);
            return selectedIndex;
        }

        private List<Participant> GetMustBe(List<Participant> allParticipants, List<Game> games)
        {
            var dict = allParticipants.ToDictionary(p => p.Id, p => 0);
            var firstRound = games.Where(g => g.Type == GameType.FirstRound).ToList();
            var secondRound = games.Where(g => g.Type == GameType.SecondRound).ToList();

            foreach(var game in firstRound)
            {
                foreach(var player in game.Players)
                {
                    dict[player.Id]++;
                }
            }

            var mustBe = dict.Where(p => p.Value == 0).Select(p => allParticipants.First(ap => ap.Id == p.Key)).ToList();

            if (secondRound.Count != 0)
            {
                foreach (var game in secondRound)
                {
                    foreach (var player in game.Players)
                    {
                        dict[player.Id]++;
                    }
                }

                mustBe.AddRange(dict.Where(p => p.Value == 1).Select(p => allParticipants.First(ap => ap.Id == p.Key)).ToList());
            }

            return mustBe;
        }

        public void RecalculateTournamentPoints(Tournament tournament)
        {
            foreach (var participant in tournament.Participants)
            {
                var gameResults = new List<int>();
                var gameRanks = new List<int>();
                var games = this.GetParticipantGames(tournament, participant.Id);
                foreach(var game in games)
                {
                    var results = game.Value.GetResult();
                    gameResults.Add(results[game.Key]);
                    gameRanks.Add(game.Value.GetRank(game.Key));
                }

                if(participant.TournamentPoints == null)
                {
                    participant.TournamentPoints = new TournamentPoints();
                }
                participant.TournamentPoints.AvaragePlace = gameRanks.Average();
                participant.TournamentPoints.PointAvg = gameResults.Average();
                participant.TournamentPoints.PointMedian = this.GetMedian(gameResults);
            }
        }

        private Dictionary<string, Game> GetParticipantGames(Tournament tournament, string participantId)
        {
            return tournament.Games.
                Where(g => g.Players.Any(p => p.Participant.Id == participantId))
                .ToDictionary(g => g.Players.First(p => p.Participant.Id == participantId).Id, g => g);
        }

        private int GetMedian(List<int> results)
        {
            var len = results.Count;
            if (len == 1)
            {
                return results.First();
            }

            var ordered= results.OrderBy(i => i);

            if (len % 2 == 0)
            {
                var medianA = results[len / 2 - 1];
                var medianB = results[len / 2];
                return (medianA + medianB) / 2;
            }

            return results[len / 2];
        }

        public void RecalculateTotalTournamentPoints(Tournament tournament)
        {
            var finalGames = tournament.Games.Where(g => g.Type == GameType.FinalRound).ToList();
            var sortedDictFinalGames = finalGames.ToDictionary(g => int.Parse(g.Name[5..]), g => g).OrderBy(g => g.Key);

            var tournamentRank = 1;
            foreach(var game in sortedDictFinalGames)
            {
                var gameResult = game.Value.GetResult().OrderBy(r => r.Value);
                foreach(var result in gameResult)
                {
                    if(tournamentRank > 20)
                    {
                        return;
                    }

                    var participant = game.Value.Players.First(p => p.Id == result.Key).Participant;
                    participant.TournamentPoints.TotalPoints = this.GetTotalPoints(tournamentRank);
                    tournamentRank++;
                }
            }
        }

        private int GetTotalPoints(int tournamentRank)
        {
            if(tournamentRank < this.winnerPointOptions.Value.Points.Count +1)
            {
                return this.winnerPointOptions.Value.Points[tournamentRank - 1];
            }

            return this.winnerPointOptions.Value.StartingIndex - tournamentRank;
        }
    }
}
