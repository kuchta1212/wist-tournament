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

            var ordered = participants.Where(p => !p.Left).OrderBy(p => p.TournamentPoints);
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
            //var preSelected = playingParticipants.OrderByDescending(p => p.User.Points).Take(amountOfGroups).ToList();
            return this.GenerateParticipantGroupsCore(playingParticipants, new List<Participant>(), amountOfGroups);
        }

        public List<List<Participant>> GenerateParticipantGroupsCore(List<Participant> participants, List<Participant> mustBe, int amountOfGroups)
        {
            var nonSelectedIndexes = new List<int>();
            for (var j = 0; j < participants.Count; j++)
            {
                if (!mustBe.Contains(participants[j]))
                {
                    nonSelectedIndexes.Add(j);
                }
            }

            var groups = new List<List<Participant>>();
            var mustBeCount = mustBe.Count;
            var mustBeIndex = 0;
            for (var i = 0; i < amountOfGroups; i++)
            {
                var group = new List<Participant>();
                if (mustBeCount > 0)
                {
                    var min = Math.Min(mustBeCount, 4);
                    for(var j = mustBeIndex; j < min; j++)
                    {
                        group.Add(mustBe[j]);
                        mustBeIndex++;
                        mustBeCount--;
                    }

                    if(min < 4)
                    {
                        for (var m = 0; m < (4- min); m++)
                        {
                            var index = this.GetRandomIndex(nonSelectedIndexes);
                            group.Add(participants[index]);
                        }
                    }
                } 
                else
                {
                    for (var m = 0; m < 4; m++)
                    {
                        var index = this.GetRandomIndex(nonSelectedIndexes);
                        group.Add(participants[index]);
                    }
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
            var mustBe = new List<Participant>();

            foreach(var game in firstRound)
            {
                foreach(var player in game.Players)
                {
                    if (dict.ContainsKey(player.Participant.Id))
                    {
                        dict[player.Participant.Id]++;
                    }
                }
            }

            if (secondRound.Count != 0)
            {
                foreach (var game in secondRound)
                {
                    foreach (var player in game.Players)
                    {
                        if (dict.ContainsKey(player.Participant.Id))
                        {
                            dict[player.Participant.Id]++;
                        }
                    }
                }

                mustBe.AddRange(dict.Where(p => p.Value > 2).Select(p => allParticipants.First(ap => ap.Id == p.Key)).ToList());
            } 
            else
            {
                mustBe.AddRange(dict.Where(p => p.Value == 0).Select(p => allParticipants.First(ap => ap.Id == p.Key)).ToList());
            }

            return mustBe;
        }

        public void RecalculateTournamentPoints(Game game, Dictionary<string, List<int>> participantPoints)
        {
            var results = game.GetResult();

            foreach (var player in game.Players)
            {

                var gamePoints = results[player.Id];
                var gamePlace = game.GetPlace(player.Id);
                if (player.Participant.TournamentPoints == null || player.Participant.TournamentPoints.IsNotUsed())
                {
                    if(player.Participant.TournamentPoints == null)
                    {
                        player.Participant.TournamentPoints = new TournamentPoints();

                    }

                    player.Participant.TournamentPoints.AvaragePlace = gamePlace;
                    if(gamePlace == 1)
                    {
                        player.Participant.TournamentPoints.AmountOfVictories = 1;
                    }
                    player.Participant.TournamentPoints.PointAvg = gamePoints.Points;
                    player.Participant.TournamentPoints.PointMedian = gamePoints.Points;
                }
                else
                {
                    player.Participant.TournamentPoints.AvaragePlace = Math.Round(
                        (player.Participant.TournamentPoints.AvaragePlace + gamePlace) /2, 
                        2);
                    if (gamePlace == 1)
                    {
                        player.Participant.TournamentPoints.AmountOfVictories++;
                    }
                    player.Participant.TournamentPoints.PointAvg = Math.Round(
                        (player.Participant.TournamentPoints.PointAvg + gamePoints.Points) / 2,
                        2);
                    player.Participant.TournamentPoints.PointMedian = this.GetMedian(participantPoints[player.Participant.Id], gamePoints.Points);
                }
            }
        }

        private Dictionary<string, Game> GetParticipantGames(List<Game> games, string participantId)
        {
            return games.
                Where(g => g.Players.Any(p => p.Participant.Id == participantId))
                .ToDictionary(g => g.Players.First(p => p.Participant.Id == participantId).Id, g => g);
        }

        private int GetMedian(List<int> results, int actualOne)
        {
            results.Add(actualOne);
            var len = results.Count;
            if(len == 0)
            {
                return 0;
            }

            if (len == 1)
            {
                return results.First();
            }

            var ordered= results.OrderBy(i => i).ToList();

            if (len % 2 == 0)
            {
                var medianA = ordered[len / 2 - 1];
                var medianB = ordered[len / 2];
                return (medianA + medianB) / 2;
            }

            return ordered[len / 2];
        }

        public void RecalculateTotalTournamentPoints(List<Game> finalGames)
        {
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
                    var totalPoints = this.GetTotalPoints(tournamentRank);
                    participant.TournamentPoints.TotalPoints = totalPoints;
                    participant.User.Points += totalPoints;
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
