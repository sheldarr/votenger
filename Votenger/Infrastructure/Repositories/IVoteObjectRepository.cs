namespace Votenger.Infrastructure.Repositories
{
    using System.Collections.Generic;
    using Domain.Response;
    using Domain.VoteObject;

    public interface IVoteObjectRepository
    {
        void AddVoteObject(VoteObject voteObject);
        ICollection<VoteObject> GetAllVoteObjects();
        VoteObject GetVoteObjectById(int id);
        ICollection<VoteObject> GetVoteObjectsForVote(ICollection<DraftResult> draftResults);
        ICollection<string> GetAllCategories();
    }
}
