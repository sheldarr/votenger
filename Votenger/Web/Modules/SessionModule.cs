namespace Votenger.Web.Modules
{
    using DTO;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.ModelBinding;

    public class SessionModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IUserRepository _userRepository;
        private readonly IVotingSessionRepository _votingSessionRepository;

        public SessionModule(IAuthorization authorization, IUserRepository userRepository, IVotingSessionRepository votingSessionRepository)
        {
            _authorization = authorization;
            _userRepository = userRepository;
            _votingSessionRepository = votingSessionRepository;

            Before += ctx =>
            {
                var isAuthorized = _authorization.CheckIfAuthorized(Request);

                return !isAuthorized ? Response.AsRedirect("/") : null;
            };

            Get["/session"] = parameters => View["session"];

            Post["/session/create"] = parameters =>
            {
                var createSessionDto = this.Bind<CreateSessionDto>();
                var user = _authorization.GetAuthorizedUser(Request);

                var votingSession = DomainObjectsFactory.CreateVotingSession(createSessionDto, user);

                _votingSessionRepository.AddVotingSession(votingSession);

                return Response.AsJson("");
            };
        }
    }
}