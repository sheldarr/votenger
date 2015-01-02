namespace Votenger.Infrastructure.Repositories
{
    using Domain;
    using Web.Models;

    public interface IUserRepository
    {
        string LoginOrCreateUserIfNotExists(UserCredentials userCredentials);
        string GetUserNickname(string hash);
        User GetUser(string hash);
        User GetUser(int id);
    }
}
