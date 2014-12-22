namespace Votenger
{
    using Authorization;
    using Data;
    using Models;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;

    public class DashboardModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        public DashboardModule(IAuthorization authorization)
        {
            _authorization = authorization;
            
            Get["/dashboard"] = parameters =>
            {
                var recordLoader = new RecordLoader();
                var dashboardModel = new DashboardModel
                {
                    GameRecords = recordLoader.GetAllComputerGames("Games")
                };

                return View["dashboard", dashboardModel];
            };
        }
    }
}