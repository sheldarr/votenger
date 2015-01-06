﻿namespace Votenger.Web.DTO
{
    using Domain.Session;

    public class CreateSessionDto
    {
        public int NumberOfPlayers { get; set; }
        public int GamesPerPlayer { get; set; }
        public VotingSessionType Type { get; set; }
    }
}
