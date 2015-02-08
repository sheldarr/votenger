namespace Votenger.Web.DTO
{
    using System.Collections.Generic;

    public class VoteSummaryDto
    {
        public ICollection<VoteObjectSummaryDto> VoteObjectsSummary { get; set; } 
    }
}
