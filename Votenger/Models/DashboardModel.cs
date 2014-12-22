namespace Votenger.Models
{
    using Data;
    using System.Collections.Generic;

    public class DashboardModel
    {
        public ICollection<GameRecord> GameRecords { get; set; }
    }
}
