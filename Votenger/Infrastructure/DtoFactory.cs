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
                Type = votingSession.Type,
                Status = votingSession.Status,
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate
            };
        }
    }
}
