﻿namespace Votenger.Infrastructure
{
    using System.Linq;
    using Domain;
    using Domain.Game;
    using Domain.Session;
    using Web.DTO;

    public class DtoFactory
    {
        public static VotingSessionDto CreateVotingSessionDto(VotingSession votingSession, User user)
        {
            return new VotingSessionDto
            {
                Id = votingSession.Id,
                Author = votingSession.Author.Nickname,
                Type = votingSession.Type.ToString(),
                Status = votingSession.Status.ToString(),
                StartDate = votingSession.StartDate,
                EndDate = votingSession.EndDate,
                IsAuthor = votingSession.Author.Id == user.Id,
                DraftAlreadyDoneByUser = votingSession.DraftResults.Any(dr => dr.UserId == user.Id),
                VoteAlreadyDoneByUser = votingSession.VoteResults.Any(vr => vr.UserId == user.Id),
            };
        }

        public static GameDto CreateGameDto(Game game)
        {
            return new GameDto
            {
                Id = game.Id,
                Name = game.Name,
                Type = game.Type.ToString(),
                Genre = game.Genre.ToString(),
                MaxPlayers = game.MaxPlayers,
            };
        }
    }
}
