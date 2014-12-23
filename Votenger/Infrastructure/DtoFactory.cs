namespace Votenger.Infrastructure
{
    using Domain.Session;
    using Web.DTO;

    public class DtoFactory
    {
        public static SessionDto CreateSessionDto(Session session)
        {
            return new SessionDto
            {
                Id = session.Id,
                SessionType = session.SessionType,
                SessionStatus = session.SessionStatus,
                StartDate = session.StartDate,
                EndDate = session.EndDate
            };
        }
    }
}
