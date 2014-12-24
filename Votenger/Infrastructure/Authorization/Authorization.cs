namespace Votenger.Infrastructure.Authorization
{
    using System.Linq;
    using Domain;
    using Nancy;
    using Repositories;

    public class Authorization : IAuthorization
    {
        private const string AuthorizationCookie = "VoteAuth";
        private readonly IUserRepository _userRepository;

        public Authorization(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public bool CheckIfAuthorized(Request request)
        {
            var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie);
            return (authorizationCookie.Key != null);
        }

        public string DecodeUserHash(Request request)
        {
            var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie);
            return authorizationCookie.Value;
        }

        public User GetAuthorizedUser(Request request)
        {
            var userHash = DecodeUserHash(request);
            return _userRepository.GetUser(userHash);
        }
    }
}
