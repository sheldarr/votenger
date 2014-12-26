namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Response;
    using Domain.Session;

    public interface IVotingSessionRepository
    {
        void AddVotingSession(VotingSession votingSession);
        VotingSession GetVotingSessionById(int id);
        ICollection<VotingSession> GetAllVotingSessions();
        void AddDraftResult(DraftResult draftResult);
        void CompleteDraft(int id);
        void CompleteVote(int id);
    }
}
