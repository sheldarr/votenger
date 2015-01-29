namespace Votenger.Domain.Game
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public GameType Type { get; set; }
        public GameGenre Genre { get; set; }
        public int MaxPlayers { get; set; }
    }
}
