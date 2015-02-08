namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using Domain.Response;
    using Domain.VoteObject;
    using Raven.Client;

    public class VoteObjectRepository : IVoteObjectRepository
    {
        private readonly IDocumentStore _documentStore;

        public VoteObjectRepository(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void AddVoteObject(VoteObject voteObject)
        {
            using (var session = _documentStore.OpenSession())
            {
                session.Store(voteObject);
                session.SaveChanges();
            }
        }

        public ICollection<VoteObject> GetAllVoteObjects()
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Query<VoteObject>().ToList();
            }
        }

        public VoteObject GetVoteObjectById(int id)
        {
            using (var session = _documentStore.OpenSession())
            {
                return session.Load<VoteObject>(id);
            }
        }

        public ICollection<VoteObject> GetVoteObjectsForVote(ICollection<DraftResult> draftResults)
        {
            using (var session = _documentStore.OpenSession())
            {
                var allVoteObjects = session.Query<VoteObject>().ToList();

                var voteObjectIds = draftResults.SelectMany(x => x.SelectedVoteObjects)
                    .Distinct()
                    .ToList();

                var voteObjectsForVote = allVoteObjects.Where(g => voteObjectIds.Any(i => i == g.Id)).ToList();

                return voteObjectsForVote;
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
