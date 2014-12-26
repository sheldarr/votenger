namespace Votenger.Infrastructure
{
    using System.Linq;
    using Domain;
    using Domain.Game;
    using Domain.Session;
    using Web.DTO;

    public class DtoFactory
    {
        public static VotingSessionDto CreateVotingSessionDto(VotingSession votingSession, User user)
        {
            return new VotingSessionDto
            {
                Id = votingSession.Id,
                Type = votingSession.Type.ToString(),
                Status = votingSession.Status.ToString(),
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate,
                DraftAlreadyDoneByUser = user.DraftResponses.Any(dr => dr.Id == votingSession.Id),
                VoteAlreadyDoneByUser = user.VoteResponses.Any(vr => vr.Id == votingSession.Id)
            };
        }

        public static GameDto CreateGameDto(Game game)
        {
            return new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Type = game.Type.ToString(),
                Genre = game.Genre.ToString(),
                MaxPlayers = game.MaxPlayers,
            };
        }
    }
}
