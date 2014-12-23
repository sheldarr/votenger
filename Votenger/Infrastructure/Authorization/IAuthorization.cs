namespace Votenger.Authorization
{
    using Nancy;

    public interface IAuthorization
    {
        bool CheckIfAuthorized(Request request);
        string DecodeNickname(Request request);
    }
}
