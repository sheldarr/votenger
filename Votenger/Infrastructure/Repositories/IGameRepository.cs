namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Game;
    using Domain.Response;

    public interface IGameRepository
    {
        void AddGame(VoteObject voteObject);
        ICollection<VoteObject> GetAllGames();
        VoteObject GetGameById(int id);
        ICollection<VoteObject> GetGamesForVote(ICollection<DraftResult> draftResults);
        ICollection<string> GetAllCategories();
    }
}
