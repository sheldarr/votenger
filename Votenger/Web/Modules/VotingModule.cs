namespace Votenger.Web.Modules
{
    using Infrastructure.Authorization;
    using Nancy;

    public class VotingModule : NancyModule
    {
        private readonly IAuthorization _authorization;

        public VotingModule(IAuthorization authorization)
        {
            _authorization = authorization;

            Before += ctx =>
            {                
                var authorizedUser = _authorization.GetAuthorizedUser(Request);

                return authorizedUser == null ? Response.AsRedirect("/") : null;
            };

            Get["/session/results/{id}"] = parameters => View["results"];

            Get["/session/draft/{id}"] = parameters => View["draft"];

            Get["/session/vote/{id}"] = parameters => View["vote"];
        }
    }
}
