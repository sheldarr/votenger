namespace Votenger.Web.DTO
{
    using System;
    using Domain.Session;

    public class VotingSessionDto
    {
        public int Id { get; set; }
        public VotingSessionType Type { get; set; }
        public VotingSessionStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsInDraftMode
        {
            get { return Status == VotingSessionStatus.Draft; }
        }

        public bool IsInVoteMode
        {
            get { return Status == VotingSessionStatus.Vote; }
        }
        
        public bool IsCompleted
        {
            get { return Status == VotingSessionStatus.Completed; }
        }
    }
}
