namespace Wist.Data
{
    using IdentityServer4.EntityFramework.Options;
    using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public class WistDbContext : ApiAuthorizationDbContext<IdentityUser>
    {
        public DbSet<Tournament> Tournaments { get; set; }

        public DbSet<Game> Games { get; set; }

        public DbSet<Round> Rounds { get; set; }

        public DbSet<Bet> Bets { get; set; }

        public DbSet<User> WistUsers { get; set; }

        public DbSet<Participant> Participants { get; set; }

        public DbSet<Player> Players { get; set; }

        public WistDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
    }
}
