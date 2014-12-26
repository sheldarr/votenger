namespace Votenger.Web.Modules
{
    using System.Linq;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Models;
    using Nancy;

    public class VotingModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IGameRepository _gameRepository;

        public VotingModule(IAuthorization authorization, IGameRepository gameRepository)
        {
            _authorization = authorization;
            _gameRepository = gameRepository;

            Before += ctx =>
            {                
                var isAuthorized = _authorization.CheckIfAuthorized(Request);

                return !isAuthorized ? Response.AsRedirect("/") : null;
            };
            
            Get["/draft/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                var draftModel = new DraftModel
                {
                    VotingSessionId = votingSessionId
                };

                return View["draft", draftModel];
            };
        }
    }
}
