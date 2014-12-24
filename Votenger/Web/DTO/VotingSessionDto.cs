namespace Votenger.Web.DTO
{
    using System;
    using Domain.Session;

    public class VotingSessionDto
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool DraftAlreadyDoneByUser { get; set; }
        public bool VoteAlreadyDoneByUser { get; set; }

        public bool IsInDraftMode
        {
            get { return Status == VotingSessionStatus.Draft.ToString(); }
        }

        public bool IsInVoteMode
        {
            get { return Status == VotingSessionStatus.Vote.ToString(); }
        }
        
        public bool IsCompleted
        {
            get { return Status == VotingSessionStatus.Completed.ToString(); }
        }
    }
}
