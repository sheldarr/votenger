namespace Votenger.Authorization
{
    using System.Linq;
    using Nancy;

    public class Authorization : IAuthorization
    {
        private const string AuthorizationCookie = "VoteAuth";

        public bool CheckIfAuthorized(Request request)
        {
            var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie);
            return (authorizationCookie.Key != null);
        }

        public string DecodeNickname(Request request)
        {
            var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie);
            return authorizationCookie.Value ?? string.Empty;
        }
    }
}
