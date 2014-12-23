namespace Votenger.Infrastructure
{
    using Domain.Session;
    using Web.DTO;

    public class DtoFactory
    {
        public static SessionDto CreateSessionDto(VotingSession votingSession)
        {
            return new SessionDto
            {
                Id = votingSession.Id,
                VotingSessionType = votingSession.VotingSessionType,
                VotingSessionStatus = votingSession.VotingSessionStatus,
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate
            };
        }
    }
}
