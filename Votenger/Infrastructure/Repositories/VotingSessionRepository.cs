namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using Domain.Session;
    using Raven.Client;

    public class VotingSessionRepository : IVotingSessionRepository
    {
        private readonly IDocumentStore _documentStore;

        public VotingSessionRepository(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void AddVotingSession(VotingSession votingSession)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                documentSession.Store(votingSession);
                documentSession.SaveChanges();
            }
        }

        public VotingSession GetVotingSessionById(int id)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                return documentSession.Load<VotingSession>(id);
            }
        }

        public ICollection<VotingSession> GetAllVotingSessions()
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                return documentSession.Query<VotingSession>().ToList();
            }
        }

        public void UpdateVotingSession(VotingSession votingSession)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var sessionToUpdate = documentSession.Load<VotingSession>(votingSession.Id);
                // ... //
                documentSession.SaveChanges();
            }
        }
    }
}
