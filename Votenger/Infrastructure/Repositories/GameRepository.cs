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

        public void AddGame(VoteObject voteObject)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(voteObject);
                session.SaveChanges();
            }
        }

        public ICollection<VoteObject> GetAllGames()
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Query<VoteObject>().ToList();
            }
        }

        public VoteObject GetGameById(int id)
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Load<VoteObject>(id);
            }
        }

        public ICollection<VoteObject> GetGamesForVote(ICollection<DraftResult> draftResults)
        {
            using (var session = _documentStore.OpenSession())
            {
                var allGames = session.Query<VoteObject>().ToList();

                var gameIds = draftResults.SelectMany(x => x.SelectedGames)
                    .Distinct()
                    .ToList();

                var gamesForVote = allGames.Where(g => gameIds.Any(i => i == g.Id)).ToList();

                return gamesForVote;
            }
        }

        public ICollection<string> GetAllCategories()
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Query<VoteObject>().Select(g => g.Category).Distinct().ToList();
            }
        }
    }
}
