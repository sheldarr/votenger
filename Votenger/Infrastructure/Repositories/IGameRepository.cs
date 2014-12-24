namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Game;

    public interface IGameRepository
    {
        void AddGame(Game game);
        ICollection<Game> GetAllGames();
    }
}
