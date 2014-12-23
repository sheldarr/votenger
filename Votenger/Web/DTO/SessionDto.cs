namespace Votenger.Web.DTO
{
    using System;
    using Domain.Session;

    public class SessionDto
    {
        public int Id { get; set; }
        public SessionType SessionType { get; set; }
        public SessionStatus SessionStatus { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsInProgress
        {
            get { return SessionStatus == SessionStatus.InProgess; }
        }

        public bool IsCompleted
        {
            get { return SessionStatus == SessionStatus.Completed; }
        }
    }
}
