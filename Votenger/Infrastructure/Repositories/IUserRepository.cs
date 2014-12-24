namespace Votenger.Infrastructure.Repositories
{
    public interface IUserRepository
    {
        void CreateUserIfNotExists(string nickname);
        string GetUserNickname(int id);
    }
}
