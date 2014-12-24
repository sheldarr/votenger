namespace Votenger.Infrastructure.Repositories
{
    public interface IUserRepository
    {
        string CreateUserIfNotExists(string nickname);
        string GetUserNickname(string id);
    }
}
