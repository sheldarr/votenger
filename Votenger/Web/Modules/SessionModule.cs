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
        private readonly IVotingSessionRepository _votingSessionRepository;

        public SessionModule(IAuthorization authorization, IVotingSessionRepository votingSessionRepository)
        {
            _authorization = authorization;
            _votingSessionRepository = votingSessionRepository;

            Before += ctx =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);

                return authorizedUser == null ? Response.AsRedirect("/") : null;
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