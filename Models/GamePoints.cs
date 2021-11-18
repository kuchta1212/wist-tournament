namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class GamePoints : IComparable
    {
        public int Points { get; set; }

        public int AmountOfDecks { get; set; }

        public int Rank { get; set; }

        public Dictionary<int, int> PartialResults { get; set; }

        public int CompareTo(object obj)
        {
            var comparer = (GamePoints)obj;

            if (this.Points < comparer.Points)
            {
                return 1;
            }

            if (this.Points > comparer.Points)
            {
                return -1;
            }

            if (this.AmountOfDecks < comparer.AmountOfDecks)
            {
                return 1;
            }

            if (this.AmountOfDecks > comparer.AmountOfDecks)
            {
                return -1;
            }

            var checkRounds = this.CheckRounds(comparer);
            if (checkRounds != 0)
            {
                return checkRounds;
            }

            if (this.Rank > comparer.Rank)
            {
                return 1;
            }

            if (this.Rank < comparer.Rank)
            {
                return -1;
            }

            return 1;
        }

        private int CheckRounds(GamePoints comparer)
        {
            int amountOfCardsToBeSkipped = 1;
            while(this.PartialResults[amountOfCardsToBeSkipped] == comparer.PartialResults[amountOfCardsToBeSkipped])
            {
                amountOfCardsToBeSkipped++;
                if(amountOfCardsToBeSkipped > 8)
                {
                    return 0;
                }
            }

            if(amountOfCardsToBeSkipped < 8)
            {
                return this.PartialResults[amountOfCardsToBeSkipped] > comparer.PartialResults[amountOfCardsToBeSkipped]
                ? 1
                : -1;
            }

            return this.PartialResults[amountOfCardsToBeSkipped] > comparer.PartialResults[amountOfCardsToBeSkipped]
                ? -1
                : 1;

        }
    }
}
