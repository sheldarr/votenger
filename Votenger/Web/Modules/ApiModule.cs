namespace Votenger.Web.Modules
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Domain.Game;
    using Domain.Response;
    using Domain.Session;
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
                var votingSessions = _votingSessionRepository.GetAllVotingSessions();

                var draftsCount = votingSessions.Where(vs => vs.Status != VotingSessionStatus.Draft).Aggregate(0, (i, session) => i + session.DraftResults.Count);

                var gamesDto = new List<GameDto>();

                foreach (var game in games)
                {
                    var gameDto = DtoFactory.CreateGameDto(game);
                    var gameDraftCount = votingSessions.Aggregate(0, (i, session) => i + session.DraftResults.Count(dr => dr.SelectedGames.Any(id => id == game.Id)));
                    gameDto.PopularityIndex = draftsCount == 0 ? "0" : ((float)gameDraftCount / draftsCount).ToString(CultureInfo.InvariantCulture);
                    gamesDto.Add(gameDto);
                }

                return Response.AsJson(gamesDto);
            };

            Get["/api/gamesForVote/{id}"] = parameters =>
            {
                int votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var games = _gameRepository.GetGamesForVote(votingSession.DraftResults);

                var gamesDto = games.Select(DtoFactory.CreateGameDto).ToList();

                return Response.AsJson(gamesDto);
            };

            Get["/api/session/result/{id}"] = parameters =>
            {
                int votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var voteSummaryDto = new VoteSummaryDto
                {
                    GamesSummary = new List<VoteObjectSummaryDto>()
                };

                foreach (var voteResult in votingSession.VoteResults)
                {
                    AddVoteResultPoints(voteResult, voteSummaryDto);
                }

                EmergeVoteWinners(voteSummaryDto);

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

        private void AddVoteResultPoints(VoteResult voteResult, VoteSummaryDto voteSummaryDto)
        {
            var threePlusesVoteObject = _gameRepository.GetGameById(voteResult.ThreePlusesVoteObject);
            var twoPlusesVoteObject = _gameRepository.GetGameById(voteResult.TwoPlusesVoteObject);
            var onePlusVoteObject = _gameRepository.GetGameById(voteResult.OnePlusVoteObject);
            var threeMinusesVoteObject = _gameRepository.GetGameById(voteResult.ThreeMinusesVoteObject);

            AddPointsToVoteObject(voteSummaryDto, threePlusesVoteObject, (int) PremiumScore.ThreePluses);
            AddPointsToVoteObject(voteSummaryDto, twoPlusesVoteObject, (int) PremiumScore.TwoPluses);
            AddPointsToVoteObject(voteSummaryDto, onePlusVoteObject, (int) PremiumScore.OnePlus);
            AddPointsToVoteObject(voteSummaryDto, threeMinusesVoteObject, (int) PremiumScore.ThreeMinuses);

            foreach (var basicScore in voteResult.BasicScores)
            {
                var basicScoreVoteObject = _gameRepository.GetGameById(basicScore.VoteObjectId);
                AddPointsToVoteObject(voteSummaryDto, basicScoreVoteObject, basicScore.Points);
            }
        }

        private static void AddPointsToVoteObject(VoteSummaryDto voteSummaryDto, VoteObject voteObject, int points)
        {
            if (voteSummaryDto.GamesSummary.All(g => g.Id != voteObject.Id))
            {
                voteSummaryDto.GamesSummary.Add(new VoteObjectSummaryDto
                {
                    Id = voteObject.Id,
                    Name = voteObject.Name,
                    Points = points
                });
            }
            else
            {
                voteSummaryDto.GamesSummary.First(g => g.Id == voteObject.Id).Points += points;
            }
        }

        private static void EmergeVoteWinners(VoteSummaryDto voteSummaryDto)
        {
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
        }
    }
}
