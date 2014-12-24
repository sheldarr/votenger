namespace Votenger.Infrastructure.Repositories
{
    using Domain;

    public interface IUserRepository
    {
        string CreateUserIfNotExists(string nickname);
        string GetUserNickname(string hash);
        User GetUser(string hash);
    }
}
