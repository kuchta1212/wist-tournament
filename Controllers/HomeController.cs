namespace Wist.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Data;

    [AllowAnonymous]
    [Route("api")]
    public class HomeController : Controller
    {
        private readonly IDbContextWrapper dbContextWrapper;

        public HomeController(IDbContextWrapper dbContextWrapper)
        {
            this.dbContextWrapper = dbContextWrapper;
        }

        [HttpPost("tournament")]
        public IActionResult CreateTournament([FromQuery]string name, [FromBody]List<string> usersIds)
        {
            this.dbContextWrapper.CreateTournament(name, usersIds);
            return new OkResult();
        }

        [HttpGet("tournaments/{tournamentId}")]
        public IActionResult GetTournaments(string tournamentId)
        {
            return new OkObjectResult(this.dbContextWrapper.GetTournament(tournamentId));
        }

        [HttpGet("tournaments")]
        public IActionResult GetTournaments()
        {
            return new OkObjectResult(this.dbContextWrapper.GetTournaments());
        }
    }
}
