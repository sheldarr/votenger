namespace Votenger.Web.DTO
{
    using Domain.Game;

    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public GameType Type { get; set; }
        public GameGenre Genre { get; set; }
        public int MaxPlayers { get; set; }
    }
}
