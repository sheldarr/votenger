namespace Votenger.Infrastructure
{
    using System.Linq;
    using Domain;
    using Domain.Session;
    using Domain.VoteObject;
    using Web.DTO;

    public class DtoFactory
    {
        public static VotingSessionDto CreateVotingSessionDto(VotingSession votingSession, User user)
        {
            return new VotingSessionDto
            {
                Id = votingSession.Id,
                Status = votingSession.Status.ToString(),
                Author = votingSession.Author.Login,
                Category = votingSession.Category,
                NumberOfVotengers = votingSession.NumberOfVotengers,
                DraftsPerVotenger = votingSession.DraftsPerVotenger,
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate,
                IsAuthor = votingSession.Author.Id == user.Id,
                DraftAlreadyDoneByUser = votingSession.DraftResults.Any(dr => dr.UserId == user.Id),
                VoteAlreadyDoneByUser = votingSession.VoteResults.Any(vr => vr.UserId == user.Id),
            };
        }

        public static VoteObjectDto CreateVoteObjectDto(VoteObject voteObject)
        {
            return new VoteObjectDto
            {
                Id = voteObject.Id,
                Name = voteObject.Name,
                Type = voteObject.Type,
                Genre = voteObject.Genre,
                MaxPlayers = voteObject.MaxPlayers,
            };
        }
    }
}
