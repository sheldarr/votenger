namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using Domain.Game;
    using Raven.Client;

    public class GameRepository : IGameRepository
    {
        private readonly IDocumentStore _documentStore;

        public GameRepository(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void AddGame(Game game)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(game);
                session.SaveChanges();
            }
        }

        public ICollection<Game> GetAllGames()
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Query<Game>().ToList();
            }
        }
    }
}
