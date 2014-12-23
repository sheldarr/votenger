namespace Votenger.Domain
{
    using Data;

    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public GameType Type { get; set; }
    }
}
