namespace Votenger.Web.DTO
{
    using System.Collections.Generic;

    public class DraftResultDto
    {
        public int VotingSessionId { get; set; }
        public ICollection<int> SelectedVoteObjects { get; set; }
    }
}
