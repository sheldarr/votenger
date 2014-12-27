namespace Votenger.Web.Modules
{
    using System.Collections.Generic;
    using System.Linq;
    using DTO;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;

    public class ApiModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IVotingSessionRepository _votingSessionRepository;
        private readonly IGameRepository _gameRepository;

        public ApiModule(IAuthorization authorization, IVotingSessionRepository votingSessionRepository, IGameRepository gameRepository)
        {
            _authorization = authorization;
            _votingSessionRepository = votingSessionRepository;
            _gameRepository = gameRepository;

            Get["/api/votingSessions"] = parameters =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var sessions = _votingSessionRepository.GetAllVotingSessions();

                var sessionsDto = sessions.Select(votingSession => DtoFactory.CreateVotingSessionDto(votingSession, authorizedUser)).ToList();
                return Response.AsJson(sessionsDto);
            };

            Get["/api/computerGames"] = parameters =>
            {
                var games = _gameRepository.GetAllGames();

                var gamesDto = games.Select(DtoFactory.CreateGameDto).ToList();

                return Response.AsJson(gamesDto);
            };

            Get["/api/gamesForVote/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);
                
                var games = _gameRepository.GetGamesForVote(votingSession.DraftResults);

                var gamesDto = new List<GameDto>();

                foreach (var game in games)
                {
                    gamesDto.Add(DtoFactory.CreateGameDto(game));
                }

                return Response.AsJson(gamesDto);
            };
        }
    }
}
