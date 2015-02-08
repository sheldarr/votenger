namespace Votenger.Domain.VoteObject
{
    public class VoteObject
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string Genre { get; set; }
        public int MaxPlayers { get; set; }
    }
}
