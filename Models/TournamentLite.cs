using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Wist.Models
{
    public class TournamentLite
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Date { get; set; }

        public List<Participant> Winners { get; set; }

        public TournamentStatus Status { get; set; }
    }
}
