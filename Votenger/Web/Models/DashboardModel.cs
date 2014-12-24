namespace Votenger.Web.Models
{
    using System.Collections.Generic;
    using DTO;

    public class DashboardModel
    {
        public ICollection<VotingSessionDto> Sessions { get; set; }
    }
}
