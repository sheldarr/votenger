namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Game;
    using Domain.Response;

    public interface IGameRepository
    {
        void AddGame(Game game);
        ICollection<Game> GetAllGames();
        ICollection<Game> GetGamesForVote(ICollection<DraftResult> draftResults);
    }
}
