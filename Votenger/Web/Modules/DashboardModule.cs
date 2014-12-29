namespace Votenger.Web.Modules
{
    using System.Linq;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Models;
    using Nancy;

    public class DashboardModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IVotingSessionRepository _votingSessionRepository;

        public DashboardModule(IAuthorization authorization, IVotingSessionRepository votingSessionRepository)
        {
            _authorization = authorization;
            _votingSessionRepository = votingSessionRepository;

            Before += ctx =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);

                return authorizedUser != null ? Response.AsRedirect("/") : null;
            };
            
            Get["/dashboard"] = parameters =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var sessions = _votingSessionRepository.GetAllVotingSessions();

                var sessionsDto = sessions.Select(votingSession => DtoFactory.CreateVotingSessionDto(votingSession, authorizedUser)).ToList();

                var dashboardModel = new DashboardModel
                {
                    Sessions = sessionsDto
                };

                return View["dashboard", dashboardModel];
            };
        }
    }
}