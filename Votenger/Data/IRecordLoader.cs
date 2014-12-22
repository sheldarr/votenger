namespace Votenger.Data
{
    using System.Collections.Generic;

    public interface IRecordLoader
    {
        ICollection<GameRecord> GetAllComputerGames(string fileName);
        ICollection<GameRecord> GetAllBoardGames(string fileName);
    }
}
