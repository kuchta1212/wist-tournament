namespace Wist.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Data;
    using Wist.Models;
    using Wist.Utils;

    [AllowAnonymous]
    [Route("api")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper dbContextWrapper;
        private readonly IUtils utils;
        private readonly IModelFactory modelFactory;
        private readonly IHubContext<Hubs, INotificationHub> hub;

        public HomeController(IDbContextWrapper dbContextWrapper, IModelFactory modelFactory, IUtils utils, IHubContext<Hubs, INotificationHub> hub)
        {
            this.dbContextWrapper = dbContextWrapper;
            this.modelFactory = modelFactory;
            this.utils = utils;
            this.hub = hub;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return new OkObjectResult(this.dbContextWrapper.GetUsers());
        }

        [HttpPost("users/{name}")]
        public IActionResult CreateUser([FromRoute]string name)
        {
            this.dbContextWrapper.CreateUser(name);
            return new OkResult();
        }

        [HttpPost("tournament")]
        public IActionResult CreateTournament([FromQuery]string name, [FromBody]List<string> usersIds)
        {
            var tournament = this.dbContextWrapper.CreateTournament(name, usersIds);
            var participantGroups = this.utils.GenerateInitialParticipantGroups(tournament.Participants);

            foreach(var participants in participantGroups)
            {
                var game = this.modelFactory.CreateGame(GameType.FirstRound, participants, participantGroups.IndexOf(participants));
                if(tournament.Games == null)
                {
                    tournament.Games = new List<Game>();
                }
                tournament.Games.Add(game);
            }

            this.dbContextWrapper.UpdateTournament(tournament);

            return new OkResult();
        }

        [HttpDelete("tournament/{tournamentId}")]
        public IActionResult DeleteTournament([FromRoute]string tournamentId)
        {
            this.dbContextWrapper.DeleteTournament(tournamentId);
            return new OkResult();
        }

        [HttpGet("tournaments/{tournamentId}")]
        public IActionResult GetTournament([FromRoute]string tournamentId)
        {
            return new OkObjectResult(this.dbContextWrapper.GetTournament(tournamentId));
        }

        [HttpGet("tournaments")]
        public IActionResult GetTournaments()
        {
            return new OkObjectResult(this.dbContextWrapper.GetTournaments().Select(t => t.ToLiteMode()));
        }

        [HttpDelete("tournament/{tournamentId}/participant/remove")]
        public IActionResult RemoveParticipant([FromRoute]string tournamentId, [FromQuery]string participantId)
        {
            this.dbContextWrapper.SetParticipantAsLeft(tournamentId, participantId);
            return new OkResult();
        }

        [HttpPost("tournament/{tournamentId}/participant/add")]
        public IActionResult ParticipantAdd([FromRoute] string tournamentId, [FromQuery] string userId)
        {
            this.dbContextWrapper.AddParticipant(tournamentId, userId);
            return new OkResult();
        }


        [HttpPost("tournament/game/{gameId}/order")]
        public async Task<IActionResult> SetGameOrder([FromBody] Dictionary<string, int> hashMap, [FromRoute]string gameId)
        {
            this.dbContextWrapper.SetGameOrder(hashMap, gameId);

            await this.hub.Clients.All.GameStarted(gameId);

            return new OkResult();
        }

        [HttpGet("tournament/game/{gameId}")]
        public IActionResult GetGame([FromRoute] string gameId)
        {
            var game = this.dbContextWrapper.GetGame(gameId);
            return new OkObjectResult(game);
        }

        [HttpPost("tournament/game/round/{roundId}/bets")]
        public IActionResult SetBets([FromRoute] string roundId, [FromBody] Dictionary<string, int> hashMap)
        {
            this.dbContextWrapper.SetRoundBets(hashMap, roundId);
            return new OkResult();
        }

        [HttpPost("tournament/game/round/{roundId}/bets/results")]
        public async Task<IActionResult> SetBetsResult([FromRoute] string roundId, [FromBody] Dictionary<string, bool> hashMap)
        {
            this.dbContextWrapper.SetRoundBetsResult(hashMap, roundId);

            await this.hub.Clients.All.GameUpdate(roundId);

            return new OkResult();
        }

        [HttpGet("tournament/game/{gameId}/result")]
        public IActionResult GetGameResult([FromRoute] string gameId)
        {
            var gameResult = this.dbContextWrapper.GetGame(gameId).GetResult().ToDictionary(kv => kv.Key, kv => kv.Value.Points);
            return new OkObjectResult(gameResult);
        }

        [HttpGet("tournament/games/{gameId}/result/place")]
        public IActionResult GetGameResultPlaces([FromRoute] string gameId)
        {
            var game = this.dbContextWrapper.GetGame(gameId);
            var dict = new Dictionary<string, int>();
            foreach(var player in game.Players)
            {
                dict.Add(player.Id, game.GetPlace(player.Id));
            }

            return new OkObjectResult(dict);
        }


        [HttpGet("tournament/game/round/{roundId}")]
        public IActionResult GetRound([FromRoute] string roundId)
        {
            var round = this.dbContextWrapper.GetRound(roundId);
            return new OkObjectResult(round);
        }

        [HttpPost("tournament/{tournamentId}/finish")]
        public async Task<IActionResult> FinishTournament([FromRoute] string tournamentId)
        {
            var finalRound = this.dbContextWrapper.GetTournamentGamesForFinalRound(tournamentId);
            this.utils.RecalculateTotalTournamentPoints(finalRound);
            foreach(var game in finalRound)
            {
                this.dbContextWrapper.UpdateGame(game);
            }

            this.dbContextWrapper.SetTournamentStateToFinish(tournamentId);

            await this.hub.Clients.All.TournamentFinished(tournamentId);

            return new OkResult();
        }

        [HttpGet("tournament/{tournamentId}/participants")]
        public IActionResult GetTournamentParticipants([FromRoute] string tournamentId)
        {
            var participants = this.dbContextWrapper.GetTournamentParticipants(tournamentId);
            return new OkObjectResult(participants);
        }

        [HttpGet("tournament/{tournamentId}/games")]
        public IActionResult GetTournamentGames([FromRoute] string tournamentId, [FromQuery] GameType type)
        {
            var games = this.dbContextWrapper.GetTournamentGamesForType(tournamentId, type);
            return new OkObjectResult(games);
        }

        [HttpPost("tournament/{tournamentId}/games/create")]
        public IActionResult CreateRoundOfGames([FromRoute] string tournamentId, [FromQuery]GameType type)
        {
            var games = this.dbContextWrapper.GetTournamentGamesForType(tournamentId, type);
            if(games.Count == 0)
            {
                this.CreateRoundOfGamesInternal(tournamentId, type);
            } 

            return new OkResult();
        }

        [HttpDelete("tournament/{tournamentId}/games/remove")]
        public IActionResult RemoveGames([FromRoute] string tournamentId, [FromQuery] GameType type)
        {
            this.RemoveRoundOfGames(tournamentId, type);

            return new OkResult();
        }

        [HttpGet("tournament/{tournamentId}/games/active")]
        public IActionResult GetActiveTournamentGames([FromRoute] string tournamentId)
        {
            var activeGames = this.dbContextWrapper.GetActiveTournamentGames(tournamentId);
            return new OkObjectResult(activeGames);
        }

        [HttpPost("tournament/games/{gameId}/finish")]
        public async Task<IActionResult> FinishGame([FromRoute] string gameId)
        {
            var game = this.dbContextWrapper.GetGame(gameId);
            game.Status = GameStatus.Finished;

            var participantPoints = this.dbContextWrapper.GetParticipantPoints(gameId, game.Players.Select(p => p.Participant.Id).ToList());

            if(game.Type != GameType.FinalRound)
            {
                this.utils.RecalculateTournamentPoints(game, participantPoints);
            }

            this.dbContextWrapper.UpdateGame(game);

            await this.hub.Clients.All.GameFinished(gameId);

            return new OkResult();
        }

        [HttpPost("tournament/{tournamentId}/recalculate")]
        public IActionResult Recalculate([FromRoute] string tournamentId)
        {
            var participants = this.dbContextWrapper.GetTournamentParticipants(tournamentId);
            
            foreach(var participant in participants)
            {
                var data = new List<Tuple<int, GamePoints>>();
                var games = this.dbContextWrapper.GetAllParticipantsGames(participant.Id, tournamentId);
                foreach(var game in games)
                {
                    var playerId = game.Players.First(p => p.Participant.Id == participant.Id).Id;

                    var result = game.GetResult()[playerId];
                    var place = game.GetPlace(playerId);

                    data.Add(Tuple.Create(place, result));
                }

                participant.TournamentPoints.AvaragePlace = Math.Round(Queryable.Average(data.Select(t => t.Item1).ToArray().AsQueryable()),2);
                participant.TournamentPoints.PointAvg = Math.Round(Queryable.Average(data.Select(t => t.Item2.Points).ToArray().AsQueryable()),2);
                participant.TournamentPoints.PointMedian = this.GetMedian(data.Select(t => t.Item2.Points).ToList());

                this.dbContextWrapper.UpdateTournamentPoints(participant.TournamentPoints);
            }


            return new OkResult();
        }

        private int GetMedian(List<int> results)
        {
            var len = results.Count;
            if (len == 1)
            {
                return results.First();
            }

            var ordered = results.OrderBy(i => i).ToList();

            if (len % 2 == 0)
            {
                var medianA = ordered[len / 2 - 1];
                var medianB = ordered[len / 2];
                return (medianA + medianB) / 2;
            }

            return ordered[len / 2];
        }

        private void CreateRoundOfGamesInternal(string tournamentId, GameType type)
        {
            var tournamentParticipants = this.dbContextWrapper.GetTournamentParticipants(tournamentId);

            List<List<Participant>> participantGroups;
            switch(type)
            {
                case GameType.FirstRound:
                    participantGroups = this.utils.GenerateInitialParticipantGroups(tournamentParticipants);
                    break;
                case GameType.FinalRound:
                    participantGroups = this.utils.GenerateFinalParticipantGroups(tournamentParticipants);
                    break;
                default:
                    var tournamentGames = this.dbContextWrapper.GetAllTournamentGames(tournamentId);
                    participantGroups = this.utils.GenerateParticipantGroups(tournamentParticipants, tournamentGames);
                    break;

            }

            var resultGames = new List<Game>();
            foreach (var participants in participantGroups)
            {
                var game = this.modelFactory.CreateGame(type, participants, participantGroups.IndexOf(participants));
                resultGames.Add(game);
            }

            this.dbContextWrapper.AddGamesIntoTournament(tournamentId, resultGames);
        }

        private void RemoveRoundOfGames(string tournamentId, GameType type)
        {
            var games = this.dbContextWrapper.GetTournamentGamesForType(tournamentId, type);
            if(games.All(g => g.Status == GameStatus.NotStarted))
            {
                this.dbContextWrapper.RemoveRoundOfGames(tournamentId, type);
            }
        }
    }
}
