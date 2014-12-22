namespace Votenger.Models
{
    using System.Collections.Generic;
    using Data;

    public class ComputerGamesModel
    {
        public ICollection<GameRecord> GameRecords { get; set; }
    }
}
