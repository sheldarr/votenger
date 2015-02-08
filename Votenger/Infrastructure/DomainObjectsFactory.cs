namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using Domain;
    using Domain.Response;
    using Domain.Session;
    using Web.DTO;

    public static class DomainObjectsFactory
    {
        public static DraftResult CreateDraftResult(DraftResultDto draftResultDto)
        {
            var draftResult = new DraftResult
            {
                VotingSessionId = draftResultDto.VotingSessionId,
                SelectedVoteObjects = draftResultDto.SelectedVoteObjects
            };

            return draftResult;
        }

        public static VoteResult CreateVoteResult(VoteResultDto voteResultDto)
        {
            var voteResult = new VoteResult
            {
                VotingSessionId = voteResultDto.VotingSessionId,
                ThreePlusesVoteObject = voteResultDto.ThreePlusesVoteObject,
                TwoPlusesVoteObject = voteResultDto.TwoPlusesVoteObject,
                OnePlusVoteObject = voteResultDto.OnePlusVoteObject,
                ThreeMinusesVoteObject = voteResultDto.ThreeMinusesVoteObject,
                BasicScores = voteResultDto.BasicScores
            };

            return voteResult;
        }

        public static VotingSession CreateVotingSession(CreateSessionDto createSessionDto, User user)
        {
            var votingSession = new VotingSession
            {
                Author = user,
                Category = createSessionDto.Category,
                Status = VotingSessionStatus.Draft,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
                DraftResults = new List<DraftResult>(),
                VoteResults = new List<VoteResult>(),
                NumberOfVotengers = createSessionDto.NumberOfVotengers,
                DraftsPerVotenger = createSessionDto.DraftsPerVotenger
            };

            return votingSession;
        }
    }
}
