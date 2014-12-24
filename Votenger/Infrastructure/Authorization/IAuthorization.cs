namespace Votenger.Infrastructure.Authorization
{
    using Domain;
    using Nancy;

    public interface IAuthorization
    {
        bool CheckIfAuthorized(Request request);
        string DecodeUserHash(Request request);
        User GetAuthorizedUser(Request request);
    }
}
