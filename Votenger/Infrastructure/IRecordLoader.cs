namespace Votenger.Infrastructure
{
    using System.Collections.Generic;
    using Domain;
    using Domain.Session;

    public interface IRecordLoader
    {
        ICollection<VotingSession>GetAllSessions(string fileName);
        ICollection<Game> GetAllComputerGames(string fileName);
        ICollection<Game> GetAllBoardGames(string fileName);
    }
}
