namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Session;

    public interface IVotingSessionRepository
    {
        void AddVotingSession(VotingSession votingSession);
        VotingSession GetVotingSessionById(int id);
        ICollection<VotingSession> GetAllVotingSessions();
        void UpdateVotingSession(VotingSession votingSession);
    }
}
