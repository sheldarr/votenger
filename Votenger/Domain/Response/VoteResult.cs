namespace Votenger.Domain.Response
{
    using System.Collections.Generic;

    public class VoteResult
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VotingSessionId { get; set; }

        public int ThreePlusesVoteObject { get; set; }
        public int TwoPlusesVoteObject { get; set; }
        public int OnePlusVoteObject { get; set; }
        public int ThreeMinusesVoteObject { get; set; }

        public IEnumerable<BasicScore> BasicScores { get; set; }  
    }
}
