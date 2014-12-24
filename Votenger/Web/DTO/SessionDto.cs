namespace Votenger.Web.DTO
{
    using System;
    using Domain.Session;

    public class SessionDto
    {
        public int Id { get; set; }
        public VotingSessionType Type { get; set; }
        public VotingSessionStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsInProgress
        {
            get { return Status == VotingSessionStatus.InProgess; }
        }

        public bool IsCompleted
        {
            get { return Status == VotingSessionStatus.Completed; }
        }
    }
}
