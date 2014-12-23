namespace Votenger.Web.Modules
{
    using System.Collections.Generic;
    using System.Linq;
    using Authorization;
    using DTO;
    using Infrastructure;
    using Models;
    using Nancy;

    public class DashboardModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        public DashboardModule(IAuthorization authorization)
        {
            _authorization = authorization;
            
            Get["/dashboard"] = parameters =>
            {
                var recordLoader = new RecordLoader();

                var sessions = recordLoader.GetAllSessions("xoxoxo");
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