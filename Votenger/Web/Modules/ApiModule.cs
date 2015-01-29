namespace Votenger.Web.Modules
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using DTO;
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;
    using Raven.Abstractions.Extensions;

    public class ApiModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IVotingSessionRepository _votingSessionRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;

        public ApiModule(IAuthorization authorization, IVotingSessionRepository votingSessionRepository, IGameRepository gameRepository, IUserRepository userRepository)
        {
            _authorization = authorization;
            _votingSessionRepository = votingSessionRepository;
            _gameRepository = gameRepository;
            _userRepository = userRepository;

            Get["/api/user/isAuthorized"] = parameters =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var isAuthorized = authorizedUser != null;

                return Response.AsJson(isAuthorized);
            };

            Get["/api/user/nickname"] = parameters =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var isAuthorized = authorizedUser != null;
                var nickname = isAuthorized ? authorizedUser.Login : String.Empty;

                return Response.AsJson(nickname);
            };

            Post["/api/user/signIn"] = parameters =>
            {
                var userCredentials = this.Bind<UserCredentialsDto>();

                var userGuid = _userRepository.LoginOrCreateUserIfNotExists(userCredentials);

                if (userGuid == String.Empty)
                {
                    return View["home"];
                }

                var voteAuthCookie = new NancyCookie("VoteAuth", userGuid);

                return Response.AsJson("").WithCookie(voteAuthCookie);
            };

            Get["/api/session/categories"] = parameters =>
            {
                var categories = _gameRepository.GetAllCategories();

                return Response.AsJson(categories);
            };

            Get["/api/session/all"] = parameters =>
            {
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var sessions = _votingSessionRepository.GetAllVotingSessions();

                var sessionsDto = sessions.Select(votingSession => DtoFactory.CreateVotingSessionDto(votingSession, authorizedUser)).ToList();
                return Response.AsJson(sessionsDto);
            };

            Get["/api/session/options/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var draftOptions = new DraftOptionsDto
                {
                    NumberOfVotengers = votingSession.NumberOfVotengers,
                    DraftsPerVotenger = votingSession.DraftsPerVotenger
                };

                return Response.AsJson(draftOptions);
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

            Get["/api/session/result/{id}"] = parameters =>
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

            Post["/api/session/create"] = parameters =>
            {
                var createSessionDto = this.Bind<CreateSessionDto>();
                var user = _authorization.GetAuthorizedUser(Request);

                var votingSession = DomainObjectsFactory.CreateVotingSession(createSessionDto, user);

                _votingSessionRepository.AddVotingSession(votingSession);

                return Response.AsJson("");
            };

            Get["/api/session/draft/complete/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                _votingSessionRepository.CompleteDraft(votingSessionId);

                return Response.AsJson("");
            };

            Get["/api/session/vote/complete/{id}"] = parameters =>
            {
                var votingSessionId = parameters.id;

                _votingSessionRepository.CompleteVote(votingSessionId);

                return Response.AsJson("");
            };

            Post["/api/session/draft/save"] = parameters =>
            {
                var draftResultDto = this.Bind<DraftResultDto>();
                var userId = _authorization.GetAuthorizedUser(Request).Id;

                var draftResult = DomainObjectsFactory.CreateDraftResult(draftResultDto);
                draftResult.UserId = userId;

                _votingSessionRepository.AddDraftResult(draftResult);

                return Response.AsJson("");
            };

            Post["/api/session/vote/save"] = parameters =>
            {
                var voteResultDto = this.Bind<VoteResultDto>();
                var userId = _authorization.GetAuthorizedUser(Request).Id;

                var voteResult = DomainObjectsFactory.CreateVoteResult(voteResultDto);
                voteResult.UserId = userId;

                _votingSessionRepository.AddVoteResult(voteResult);

                return Response.AsJson("");
            };
        }
    }
}
