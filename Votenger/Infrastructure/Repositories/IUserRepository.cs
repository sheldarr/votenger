namespace Votenger.Infrastructure.Repositories
{
    using Domain;
    using Web.DTO;

    public interface IUserRepository
    {
        string LoginOrCreateUserIfNotExists(UserCredentialsDto userCredentials);
        string GetUserNickname(string hash);
        User GetUser(string hash);
        User GetUser(int id);
    }
}
