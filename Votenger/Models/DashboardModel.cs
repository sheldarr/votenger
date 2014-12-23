namespace Votenger.Models
{
    using System.Collections.Generic;
    using Web.DTO;

    public class DashboardModel
    {
        public ICollection<SessionDto> Sessions { get; set; }
    }
}
