namespace Votenger.Domain.Response
{
    using System.Collections.Generic;

    public class DraftResult
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VotingSessionId { get; set; }
        public ICollection<int> SelectedGames { get; set; } 
    }
}
