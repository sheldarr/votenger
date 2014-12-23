namespace Votenger.Infrastructure
{
    using System.Collections.Generic;
    using Data;
    using Domain.Session;

    public interface IRecordLoader
    {
        ICollection<Session>GetAllSessions(string fileName);
        ICollection<GameRecord> GetAllComputerGames(string fileName);
        ICollection<GameRecord> GetAllBoardGames(string fileName);
    }
}
