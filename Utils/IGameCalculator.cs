namespace Wist.Utils
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Wist.Models;

    public interface IGameCalculator
    {
        public Dictionary<string, GamePoints> GetResult(Game game);

        public int GetPlace(string playerId, Game game);

        public Dictionary<string, int> GetPlaces(Dictionary<string, GamePoints> gameResults);
    }
}
