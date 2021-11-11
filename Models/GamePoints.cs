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
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public int Points { get; set; }

        public int AmountOfDecks { get; set; }

        public int Rank { get; set; }

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
    }
}
