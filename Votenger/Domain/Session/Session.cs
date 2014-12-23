namespace Votenger.Domain.Session
{
    using System;

    public class Session
    {
        public int Id { get; set; }
        public SessionType SessionType { get; set; }
        public SessionStatus SessionStatus { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
