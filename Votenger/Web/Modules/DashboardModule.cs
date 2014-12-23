namespace Votenger.Web.Modules
{
    using System.Linq;
    using Authorization;
    using Data;
    using Domain;
    using Infrastructure;
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
                var isAuthorized = _authorization.CheckIfAuthorized(Request);

                return !isAuthorized ? Response.AsRedirect("/") : null;
            };
            
            Get["/dashboard"] = parameters =>
            {
                var sessions = _votingSessionRepository.GetAllVotingSessions();
                var sessionsDto = sessions.Select(DtoFactory.CreateSessionDto).ToList();

                var dashboardModel = new DashboardModel
                {
                    Sessions = sessionsDto
                };

                return View["dashboard", dashboardModel];
            };
        }
    }
}