namespace Votenger.Web.DTO
{
    using System;

    public class VoteObjectSummaryDto
    {
        public int Id { get; set; }
        public String Name { get; set; }
        public int Points { get; set; }
        public bool FirstPlace { get; set; }
        public bool SecondPlace { get; set; }
        public bool ThirdPlace { get; set; }
    }
}
