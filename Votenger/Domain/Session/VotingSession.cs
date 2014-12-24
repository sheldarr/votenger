namespace Votenger.Domain.Session
{
    using System;

    public class VotingSession
    {
        public int Id { get; set; }
        public VotingSessionType Type { get; set; }
        public VotingSessionStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
