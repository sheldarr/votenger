namespace Votenger.Domain.Response
{
    using System.Collections.Generic;
    using Session;

    public class DraftResponse
    {
        public int Id { get; set; }
        public VotingSession VotingSession { get; set; }
        public ICollection<int> SelectedGames { get; set; } 
    }
}
