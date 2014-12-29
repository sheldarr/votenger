namespace Votenger.Web.DTO
{
    using System.Collections.Generic;

    public class VoteSummaryDto
    {
        public ICollection<GameSummaryDto> GamesSummary { get; set; } 
    }
}
