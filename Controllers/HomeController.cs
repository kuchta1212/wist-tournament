namespace Wist.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
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

        public HomeController(IDbContextWrapper dbContextWrapper, IModelFactory modelFactory, IUtils utils)
        {
            this.dbContextWrapper = dbContextWrapper;
            this.modelFactory = modelFactory;
            this.utils = utils;
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
        public IActionResult SetGameOrder([FromBody] Dictionary<string, int> hashMap, [FromRoute]string gameId)
        {
            this.dbContextWrapper.SetGameOrder(hashMap, gameId);
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
        public IActionResult SetBetsResult([FromRoute] string roundId, [FromBody] Dictionary<string, bool> hashMap)
        {
            this.dbContextWrapper.SetRoundBetsResult(hashMap, roundId);
            return new OkResult();
        }

        [HttpGet("tournament/game/{gameId}/result")]
        public IActionResult GetGameResult([FromRoute] string gameId)
        {
            var gameResult = this.dbContextWrapper.GetGame(gameId).GetResult();
            return new OkObjectResult(gameResult);
        }

        [HttpGet("tournament/game/round/{roundId}")]
        public IActionResult GetRound([FromRoute] string roundId)
        {
            var round = this.dbContextWrapper.GetRound(roundId);
            return new OkObjectResult(round);
        }

        [HttpPost("tournament/{tournamentId}/finish")]
        public IActionResult FinishTournament([FromRoute] string tournamentId)
        {
            var tournament = this.dbContextWrapper.GetTournament(tournamentId);
            this.utils.RecalculateTotalTournamentPoints(tournament);
            this.dbContextWrapper.UpdateTournament(tournament);
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
            else
            {
                this.RemoveRoundOfGames(tournamentId, type);
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

        private void CreateRoundOfGamesInternal(string tournamentId, GameType type)
        {
            var tournamentParticipants = this.dbContextWrapper.GetTournamentParticipants(tournamentId);

            List<List<Participant>> participantGroups;
            if( type != GameType.FirstRound)
            {
                var tournamentGames = this.dbContextWrapper.GetAllTournamentGames(tournamentId);
                this.utils.RecalculateTournamentPoints(tournamentParticipants, tournamentGames);
                participantGroups = this.utils.GenerateParticipantGroups(tournamentParticipants, tournamentGames);
            } 
            else
            {
                participantGroups = this.utils.GenerateInitialParticipantGroups(tournamentParticipants);
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
            this.dbContextWrapper.RemoveRoundOfGames(tournamentId, type);
        }
    }
}
