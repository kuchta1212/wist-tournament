namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class TournamentPoints : IComparable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public double AvaragePlace { get; set; }

        public int PointMedian { get; set; }

        public double PointAvg { get; set; }

        public int TotalPoints { get; set; }

        public int CompareTo(object obj)
        {
            var comparer = (TournamentPoints)obj;

            if (this.AvaragePlace > comparer.AvaragePlace)
            {
                return 1;
            }

            if (this.AvaragePlace < comparer.AvaragePlace)
            {
                return -1;
            }

            if (this.PointMedian < comparer.PointMedian)
            {
                return 1;
            }

            if (this.PointMedian > comparer.PointMedian)
            {
                return -1;
            }

            if (this.PointAvg < comparer.PointAvg)
            {
                return 1;
            }

            if (this.PointAvg > comparer.PointAvg)
            {
                return -1;
            }

            return 1;
        }
    }
}
