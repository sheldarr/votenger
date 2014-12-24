namespace Votenger.Infrastructure
{
    using Domain.Game;
    using Domain.Session;
    using Web.DTO;

    public class DtoFactory
    {
        public static VotingSessionDto CreateVotingSessionDto(VotingSession votingSession)
        {
            return new VotingSessionDto
            {
                Id = votingSession.Id,
                Type = votingSession.Type,
                Status = votingSession.Status,
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate
            };
        }

        public static GameDto CreateGameDto(Game game)
        {
            return new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Type = game.Type,
                Genre = game.Genre,
                MaxPlayers = game.MaxPlayers,
            };
        }
    }
}
