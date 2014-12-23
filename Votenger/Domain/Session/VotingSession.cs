namespace Votenger.Domain.Session
{
    using System;

    public class VotingSession
    {
        public int Id { get; set; }
        public VotingSessionType VotingSessionType { get; set; }
        public VotingSessionStatus VotingSessionStatus { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
