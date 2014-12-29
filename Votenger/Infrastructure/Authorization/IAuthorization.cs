namespace Votenger.Infrastructure.Authorization
{
    using Domain;
    using Nancy;

    public interface IAuthorization
    {
        User GetAuthorizedUser(Request request);
    }
}
