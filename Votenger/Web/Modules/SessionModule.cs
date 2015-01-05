namespace Votenger.Web.Modules
{
    using Infrastructure.Authorization;
    using Nancy;

    public class SessionModule : NancyModule
    {
        private readonly IAuthorization _authorization;

        public SessionModule(IAuthorization authorization)
        {
            _authorization = authorization;

            Before += ctx =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);

                return authorizedUser == null ? Response.AsRedirect("/") : null;
            };

            Get["/session"] = parameters => View["session"];
        }
    }
}