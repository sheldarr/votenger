namespace Votenger.Domain.Response
{
    using Session;

    public class VoteResponse
    {
        public int Id { get; set; }
        public VotingSession VotingSession { get; set; }
    }
}
