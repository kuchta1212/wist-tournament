namespace Wist.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public interface INotificationHub
    {
        Task GameUpdate(string gameId);

        Task GameFinished(string gameId);

        Task GameStarted(string gameId);
    }
}
