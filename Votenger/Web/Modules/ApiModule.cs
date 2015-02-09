namespace Votenger.Web.Modules
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using Domain.Response;
    using Domain.Session;
    using Domain.VoteObject;
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
        private readonly IVoteObjectRepository _voteObjectRepository;
        private readonly IUserRepository _userRepository;

        public ApiModule(IAuthorization authorization, IVotingSessionRepository votingSessionRepository, IVoteObjectRepository voteObjectRepository, IUserRepository userRepository)
        {
            _authorization = authorization;
            _votingSessionRepository = votingSessionRepository;
            _voteObjectRepository = voteObjectRepository;
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
                var categories = _voteObjectRepository.GetAllCategories();

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

            Get["/api/voteObjectsForDraft/{id}"] = parameters =>
            {
                int votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);               

                var voteObjects = _voteObjectRepository.GetVoteObjectsByCategory(votingSession.Category);
                var votingSessions = _votingSessionRepository.GetVotingSessionsByCategory(votingSession.Category);

                var draftsCount = votingSessions.Where(vs => vs.Status != VotingSessionStatus.Draft).Aggregate(0, (i, session) => i + session.DraftResults.Count);

                var voteObjectsDto = new List<VoteObjectDto>();

                foreach (var voteObject in voteObjects)
                {
                    var voteObjectDto = DtoFactory.CreateVoteObjectDto(voteObject);
                    var voteObjectDraftCount = votingSessions.Aggregate(0, (i, session) => i + session.DraftResults.Count(dr => dr.SelectedVoteObjects.Any(id => id == voteObject.Id)));
                    voteObjectDto.PopularityIndex = draftsCount == 0 ? "0" : ((float)voteObjectDraftCount / draftsCount).ToString(CultureInfo.InvariantCulture);
                    voteObjectsDto.Add(voteObjectDto);
                }

                return Response.AsJson(voteObjectsDto);
            };

            Get["/api/voteObjectsForVote/{id}"] = parameters =>
            {
                int votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var voteObjects = _voteObjectRepository.GetVoteObjectsForVote(votingSession.DraftResults);

                var voteObjectDto = voteObjects.Select(DtoFactory.CreateVoteObjectDto).ToList();

                return Response.AsJson(voteObjectDto);
            };

            Get["/api/session/result/{id}"] = parameters =>
            {
                int votingSessionId = parameters.id;
                var votingSession = _votingSessionRepository.GetVotingSessionById(votingSessionId);

                var voteSummaryDto = new VoteSummaryDto
                {
                    VoteObjectsSummary = new List<VoteObjectSummaryDto>()
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
            var threePlusesVoteObject = _voteObjectRepository.GetVoteObjectById(voteResult.ThreePlusesVoteObject);
            var twoPlusesVoteObject = _voteObjectRepository.GetVoteObjectById(voteResult.TwoPlusesVoteObject);
            var onePlusVoteObject = _voteObjectRepository.GetVoteObjectById(voteResult.OnePlusVoteObject);
            var threeMinusesVoteObject = _voteObjectRepository.GetVoteObjectById(voteResult.ThreeMinusesVoteObject);

            AddPointsToVoteObject(voteSummaryDto, threePlusesVoteObject, (int) PremiumScore.ThreePluses);
            AddPointsToVoteObject(voteSummaryDto, twoPlusesVoteObject, (int) PremiumScore.TwoPluses);
            AddPointsToVoteObject(voteSummaryDto, onePlusVoteObject, (int) PremiumScore.OnePlus);
            AddPointsToVoteObject(voteSummaryDto, threeMinusesVoteObject, (int) PremiumScore.ThreeMinuses);

            foreach (var basicScore in voteResult.BasicScores)
            {
                var basicScoreVoteObject = _voteObjectRepository.GetVoteObjectById(basicScore.VoteObjectId);
                AddPointsToVoteObject(voteSummaryDto, basicScoreVoteObject, basicScore.Points);
            }
        }

        private static void AddPointsToVoteObject(VoteSummaryDto voteSummaryDto, VoteObject voteObject, int points)
        {
            if (voteSummaryDto.VoteObjectsSummary.All(g => g.Id != voteObject.Id))
            {
                voteSummaryDto.VoteObjectsSummary.Add(new VoteObjectSummaryDto
                {
                    Id = voteObject.Id,
                    Name = voteObject.Name,
                    Points = points
                });
            }
            else
            {
                voteSummaryDto.VoteObjectsSummary.First(g => g.Id == voteObject.Id).Points += points;
            }
        }

        private static void EmergeVoteWinners(VoteSummaryDto voteSummaryDto)
        {
            var groupByPoints = voteSummaryDto.VoteObjectsSummary.GroupBy(o => o.Points).OrderByDescending(o => o.Key).ToList();

            voteSummaryDto.VoteObjectsSummary.Where(g => g.Points == groupByPoints.ElementAt(0).Key).ForEach(g => g.FirstPlace = true);
            if (groupByPoints.Count > 1)
            {
                voteSummaryDto.VoteObjectsSummary.Where(g => g.Points == groupByPoints.ElementAt(1).Key)
                    .ForEach(g => g.SecondPlace = true);
            }
            if (groupByPoints.Count > 2)
            {
                voteSummaryDto.VoteObjectsSummary.Where(g => g.Points == groupByPoints.ElementAt(2).Key)
                    .ForEach(g => g.ThirdPlace = true);
            }
        }
    }
}
