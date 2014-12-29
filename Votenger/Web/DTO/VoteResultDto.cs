namespace Votenger.Web.DTO
{
    public class VoteResultDto
    {
        public int VotingSessionId { get; set; }

        public int MustPlayGame { get; set; }
        public int MustNotPlayGame { get; set; }
        public int ThreePointsGame { get; set; }
        public int TwoPointsGame { get; set; }
        public int OnePointGame { get; set; }
    }
}
