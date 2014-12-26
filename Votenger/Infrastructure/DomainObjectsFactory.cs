namespace Votenger.Infrastructure
{
    using Domain.Response;
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
    }
}
