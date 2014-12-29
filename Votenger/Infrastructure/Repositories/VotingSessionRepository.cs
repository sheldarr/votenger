namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using System.Linq;
    using Domain.Response;
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

        public void AddDraftResult(DraftResult draftResult)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var votingSession = documentSession.Load<VotingSession>(draftResult.VotingSessionId);
                votingSession.DraftResults.Add(draftResult);
                documentSession.SaveChanges();
            }
        }

        public void AddVoteResult(VoteResult voteResult)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var votingSession = documentSession.Load<VotingSession>(voteResult.VotingSessionId);
                votingSession.VoteResults.Add(voteResult);
                documentSession.SaveChanges();
            }
        }

        public void CompleteDraft(int id)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var votingSession = documentSession.Load<VotingSession>(id);
                votingSession.Status = VotingSessionStatus.Vote;
                documentSession.SaveChanges();
            }
        }

        public void CompleteVote(int id)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var votingSession = documentSession.Load<VotingSession>(id);
                votingSession.Status = VotingSessionStatus.Completed;
                documentSession.SaveChanges();
            }
        }
    }
}
