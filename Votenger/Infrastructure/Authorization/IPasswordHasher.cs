namespace Votenger.Infrastructure.Authorization
{
    public interface IPasswordHasher
    {
        string HashPassword(string password);
    }
}
