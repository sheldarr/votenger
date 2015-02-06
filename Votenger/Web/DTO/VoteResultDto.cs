namespace Votenger.Web.DTO
{
    using System.Collections.Generic;
    using Domain.Response;

    public class VoteResultDto
    {
        public int VotingSessionId { get; set; }

        public int ThreePlusesVoteObject { get; set; }
        public int TwoPlusesVoteObject { get; set; }
        public int OnePlusVoteObject { get; set; }
        public int ThreeMinusesVoteObject { get; set; }

        public IEnumerable<BasicScore> BasicScores { get; set; }  
    }
}
