namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Game;
    using Domain.Response;

    public interface IGameRepository
    {
        void AddGame(Game game);
        ICollection<Game> GetAllGames();
        Game GetGameById(int id);
        ICollection<Game> GetGamesForVote(ICollection<DraftResult> draftResults);
    }
}
