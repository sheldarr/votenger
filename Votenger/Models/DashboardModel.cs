﻿namespace Votenger.Models
{
    using System.Collections.Generic;
    using Web.DTO;

    public class DashboardModel
    {
        public ICollection<VotingSessionDto> Sessions { get; set; }
    }
}
