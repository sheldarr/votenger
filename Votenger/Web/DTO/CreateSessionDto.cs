namespace Votenger.Web.DTO
{
    public class CreateSessionDto
    {
        public int NumberOfVotengers { get; set; }
        public int DraftsPerVotenger { get; set; }
        public string Category { get; set; }
    }
}
