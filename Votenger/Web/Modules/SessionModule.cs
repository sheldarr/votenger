namespace Votenger.Web.Modules
{
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Models;

    public class SessionModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IUserRepository _userRepository;

        public SessionModule(IAuthorization authorization, IUserRepository userRepository)
        {
            _authorization = authorization;
            _userRepository = userRepository;

            Before += ctx =>
            {
                var isAuthorized = _authorization.CheckIfAuthorized(Request);

                return !isAuthorized ? Response.AsRedirect("/") : null;
            };

            Get["/session"] = parameters => View["session"];

            Post["/session/create"] = parameters =>
            {
                return Response.AsJson("");
            };
        }
    }
}