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

        [HttpPost("tournament/next")]
        public IActionResult CreateNextRound([FromQuery]string tournamentId)
        {
            var tournament = this.dbContextWrapper.GetTournament(tournamentId);

            this.utils.RecalculateTournamentPoints(tournament);

            var participantGroups = this.utils.GenerateInitialParticipantGroups(tournament.Participants);

            var type = tournament.Games.Any(g => g.Type == GameType.SecondRound) ? GameType.ThirdRound : GameType.SecondRound;
            foreach (var participants in participantGroups)
            {
                var game = this.modelFactory.CreateGame(type, participants, participantGroups.IndexOf(participants));
                if (tournament.Games == null)
                {
                    tournament.Games = new List<Game>();
                }
                tournament.Games.Add(game);
            }

            this.dbContextWrapper.UpdateTournament(tournament);

            return new OkResult();
        }

        [HttpPost("tournament/final")]
        public IActionResult CreateFinalRound([FromQuery] string tournamentId)
        {
            var tournament = this.dbContextWrapper.GetTournament(tournamentId);
            this.utils.RecalculateTournamentPoints(tournament);

            var participantGroups = this.utils.GenerateFinalParticipantGroups(tournament.Participants);

            foreach (var participants in participantGroups)
            {
                var game = this.modelFactory.CreateGame(GameType.FinalRound, participants, participantGroups.IndexOf(participants));
                if (tournament.Games == null)
                {
                    tournament.Games = new List<Game>();
                }
                tournament.Games.Add(game);
            }

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
            return new OkObjectResult(this.dbContextWrapper.GetTournaments());
        }

        [HttpPost("tournament/participant/leave")]
        public IActionResult ParticipantLeaves([FromQuery]string tournamentId, [FromQuery]string participantId)
        {
            this.dbContextWrapper.SetParticipantAsLeft(tournamentId, participantId);
            return new OkResult();
        }

        [HttpPost("tournament/participant/add")]
        public IActionResult ParticipantAdd([FromQuery] string tournamentId, [FromQuery] string userId)
        {
            this.dbContextWrapper.AddParticipant(tournamentId, userId);
            return new OkResult();
        }


        [HttpPost("tournament/game/{gameId}/order")]
        public IActionResult SetGameOrder([FromBody] Dictionary<string, int> order, [FromRoute]string gameId)
        {
            this.dbContextWrapper.SetGameOrder(order, gameId);
            return new OkResult();
        }

        [HttpGet("tournament/game")]
        public IActionResult GetGame([FromQuery] string gameId)
        {
            var game = this.dbContextWrapper.GetGame(gameId);
            return new OkObjectResult(game);
        }

        [HttpPost("tournament/game/round/{roundId}/bets")]
        public IActionResult SetBets([FromRoute] string roundId, [FromBody] Dictionary<string, int> bets)
        {
            this.dbContextWrapper.SetRoundBets(bets, roundId);
            return new OkResult();
        }

        [HttpPost("tournament/game/round/{roundId}/bets/results")]
        public IActionResult SetBetsResult([FromRoute] string roundId, [FromBody] Dictionary<string, bool> results)
        {
            this.dbContextWrapper.SetRoundBetsResult(results, roundId);
            return new OkResult();
        }

        [HttpGet("tournament/game/{gameId}/result")]
        public IActionResult GetGameResult([FromRoute] string gameId)
        {
            var gameResult = this.dbContextWrapper.GetGame(gameId).GetResult();
            return new OkObjectResult(gameResult);
        }
    }
}
