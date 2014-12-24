namespace Votenger.Infrastructure.Authorization
{
    using Nancy;

    public interface IAuthorization
    {
        bool CheckIfAuthorized(Request request);
        string DecodeUserGuid(Request request);
    }
}
