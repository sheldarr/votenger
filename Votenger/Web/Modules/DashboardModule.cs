namespace Votenger.Web.Modules
{
    using Infrastructure.Authorization;
    using Nancy;

    public class DashboardModule : NancyModule
    {
        private readonly IAuthorization _authorization;

        public DashboardModule(IAuthorization authorization)
        {
            _authorization = authorization;

            Before += ctx =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);

                return authorizedUser == null ? Response.AsRedirect("/") : null;
            };
            
            Get["/dashboard"] = parameters => View["dashboard"];
        }
    }
}