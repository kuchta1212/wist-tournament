namespace Wist.Controllers
{
    using Microsoft.AspNetCore.SignalR;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public class Hubs : Hub<INotificationHub>
    {

    }
}
