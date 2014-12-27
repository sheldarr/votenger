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
                SelectedGames = draftResultDto.SelectedGames
            };

            return draftResult;
        }

        public static VotingSession CreateVotingSession(CreateSessionDto createSessionDto, User user)
        {
            var votingSession = new VotingSession()
            {
                Author = user,
                Type = createSessionDto.Type,
                Status = VotingSessionStatus.Draft,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
                DraftResults = new List<DraftResult>()
            };

            return votingSession;
        }
    }
}
