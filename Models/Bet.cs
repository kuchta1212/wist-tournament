namespace Wist.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Threading.Tasks;

    public class Bet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public int Tip { get; set; }

        public bool IsSuccess { get; set; }

        public Player Player { get; set; }

        public BetStatus Status { get; set; }

        public int GetResult() => this.IsSuccess ? this.Tip + 10 : this.Tip * (-1); 
    }
}
