namespace Votenger.Web.DTO
{
    using System;
    using Domain.Session;

    public class SessionDto
    {
        public int Id { get; set; }
        public VotingSessionType VotingSessionType { get; set; }
        public VotingSessionStatus VotingSessionStatus { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsInProgress
        {
            get { return VotingSessionStatus == VotingSessionStatus.InProgess; }
        }

        public bool IsCompleted
        {
            get { return VotingSessionStatus == VotingSessionStatus.Completed; }
        }
    }
}
