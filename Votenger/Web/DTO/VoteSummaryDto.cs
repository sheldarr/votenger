namespace Votenger.Web.DTO
{
    using System.Collections.Generic;

    public class VoteSummaryDto
    {
        public ICollection<VoteObjectSummaryDto> GamesSummary { get; set; } 
    }
}
