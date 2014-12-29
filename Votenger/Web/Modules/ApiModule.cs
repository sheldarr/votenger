namespace Votenger.Web.Modules
{
    using System.Collections.Generic;
    using System.Linq;
    using DTO;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Raven.Abstractions.Extensions;

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

            Get["/api/voteResults/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var voteSummaryDto = new VoteSummaryDto
                {
                    GamesSummary = new List<GameSummaryDto>()
                };

                foreach (var voteResult in votingSession.VoteResults)
                {
                    var mustPlayGame = _gameRepository.GetGameById(voteResult.MustPlayGame);
                    var mustNotPlayGame = _gameRepository.GetGameById(voteResult.MustNotPlayGame);
                    var threePointsGame = _gameRepository.GetGameById(voteResult.ThreePointsGame);
                    var twoPointsGame = _gameRepository.GetGameById(voteResult.TwoPointsGame);
                    var onePointGame = _gameRepository.GetGameById(voteResult.OnePointGame);

                    if(voteSummaryDto.GamesSummary.All(g => g.Id != mustPlayGame.Id))
                    {
                        voteSummaryDto.GamesSummary.Add(new GameSummaryDto
                        {
                            Id = mustPlayGame.Id,
                            Name = mustPlayGame.Name,
                            Points = 5
                        });
                    }
                    else
                    {
                        voteSummaryDto.GamesSummary.First(g => g.Id == mustPlayGame.Id).Points += 5;
                    }

                    if(voteSummaryDto.GamesSummary.All(g => g.Id != mustNotPlayGame.Id))
                    {
                        voteSummaryDto.GamesSummary.Add(new GameSummaryDto
                        {
                            Id = mustNotPlayGame.Id,
                            Name = mustNotPlayGame.Name,
                            Points = -5
                        });
                    }
                    else
                    {
                        voteSummaryDto.GamesSummary.First(g => g.Id == mustNotPlayGame.Id).Points -= 5;
                    }

                    if(voteSummaryDto.GamesSummary.All(g => g.Id != threePointsGame.Id))
                    {
                        voteSummaryDto.GamesSummary.Add(new GameSummaryDto
                        {
                            Id = threePointsGame.Id,
                            Name = threePointsGame.Name,
                            Points = 3
                        });
                    }
                    else
                    {
                        voteSummaryDto.GamesSummary.First(g => g.Id == threePointsGame.Id).Points += 3;
                    }

                      if(voteSummaryDto.GamesSummary.All(g => g.Id != twoPointsGame.Id))
                    {
                        voteSummaryDto.GamesSummary.Add(new GameSummaryDto
                        {
                            Id = twoPointsGame.Id,
                            Name = twoPointsGame.Name,
                            Points = 2
                        });
                    }
                    else
                    {
                        voteSummaryDto.GamesSummary.First(g => g.Id == twoPointsGame.Id).Points += 2;
                    }

                    if(voteSummaryDto.GamesSummary.All(g => g.Id != onePointGame.Id))
                    {
                        voteSummaryDto.GamesSummary.Add(new GameSummaryDto
                        {
                            Id = onePointGame.Id,
                            Name = onePointGame.Name,
                            Points = 1
                        });
                    }
                    else
                    {
                        voteSummaryDto.GamesSummary.First(g => g.Id == onePointGame.Id).Points += 1;
                    }
                }

                var groupByPoints = voteSummaryDto.GamesSummary.GroupBy(o => o.Points).OrderByDescending(o => o.Key).ToList();
               
                voteSummaryDto.GamesSummary.Where(g => g.Points == groupByPoints.ElementAt(0).Key).ForEach(g => g.FirstPlace = true);
                if (groupByPoints.Count > 1)
                {
                    voteSummaryDto.GamesSummary.Where(g => g.Points == groupByPoints.ElementAt(1).Key)
                        .ForEach(g => g.SecondPlace = true);
                }
                if (groupByPoints.Count > 2)
                {
                    voteSummaryDto.GamesSummary.Where(g => g.Points == groupByPoints.ElementAt(2).Key)
                        .ForEach(g => g.ThirdPlace = true);
                }

                return Response.AsJson(voteSummaryDto);
            };
        }
    }
}
