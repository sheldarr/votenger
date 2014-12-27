namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using Domain.Game;
    using Domain.Response;
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

        public ICollection<Game> GetGamesForVote(ICollection<DraftResult> draftResults)
        {
            using (var session = _documentStore.OpenSession())
            {
                draftResults.Add(new DraftResult
                {
                    SelectedGames = new List<int> {1, 2, 3}
                });

                var allGames = session.Query<Game>().ToList();

                var gameIds = draftResults.SelectMany(x => x.SelectedGames)
                    .Distinct()
                    .ToList();

                var gamesForVote = allGames.Where(g => gameIds.Any(i => i == g.Id)).ToList();

                return gamesForVote;
            }
        }
    }
}
