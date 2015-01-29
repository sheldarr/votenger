namespace Votenger.Domain.Session
{
    using System;
    using System.Collections.Generic;
    using Response;

    public class VotingSession
    {
        public int Id { get; set; }
        public User Author { get; set; }
        public string Category { get; set; }
        public VotingSessionStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ICollection<DraftResult> DraftResults { get; set; }
        public ICollection<VoteResult> VoteResults { get; set; }
        public int NumberOfVotengers { get; set; }
        public int DraftsPerVotenger { get; set; }
    }
}
