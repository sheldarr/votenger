namespace Votenger.Web.Modules
{
    using DTO;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Models;
    using Nancy;
    using Nancy.ModelBinding;

    public class VotingModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IGameRepository _gameRepository;
        private readonly IVotingSessionRepository _votingSessionRepository;

        public VotingModule(IAuthorization authorization, IGameRepository gameRepository, IVotingSessionRepository votingSessionRepository)
        {
            _authorization = authorization;
            _gameRepository = gameRepository;
            _votingSessionRepository = votingSessionRepository;

            Before += ctx =>
            {                
                var isAuthorized = _authorization.CheckIfAuthorized(Request);

                return !isAuthorized ? Response.AsRedirect("/") : null;
            };

            Get["/results/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                var resultsModel = new ResultsModel
                {
                    VotingSessionId = votingSessionId
                };

                return View["results", resultsModel];
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

            Get["/vote/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                var voteModel = new VoteModel
                {
                    VotingSessionId = votingSessionId
                };

                return View["vote", voteModel];
            };

            Get["/draft/complete/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                _votingSessionRepository.CompleteDraft(votingSessionId);

                return Response.AsJson("");
            };

            Get["/vote/complete/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                _votingSessionRepository.CompleteVote(votingSessionId);

                return Response.AsJson("");
            };

            Post["/draft/save"] = parameters =>
            {
                var draftResultDto = this.Bind<DraftResultDto>();
                var userId = _authorization.GetAuthorizedUserId(Request);

                var draftResult = DomainObjectsFactory.CreateDraftResult(draftResultDto);
                draftResult.UserId = userId;

                _votingSessionRepository.AddDraftResult(draftResult);                

                return Response.AsJson("");
            };

            Post["/vote/save"] = parameters =>
            {
                var voteResultDto = this.Bind<VoteResultDto>();
                var userId = _authorization.GetAuthorizedUserId(Request);

                var voteResult = DomainObjectsFactory.CreateVoteResult(voteResultDto);
                voteResult.UserId = userId;

                _votingSessionRepository.AddVoteResult(voteResult);

                return Response.AsJson("");
            };
        }
    }
}
