namespace Votenger.Domain.Response
{
    public class VoteResult
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VotingSessionId { get; set; }

        public int MustPlayGame { get; set; }
        public int MustNotPlayGame { get; set; }
        public int ThreePointsGame { get; set; }
        public int TwoPointsGame { get; set; }
        public int OnePointGame { get; set; }
    }
}
