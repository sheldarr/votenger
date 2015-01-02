namespace Votenger.Infrastructure.Authorization
{
    using System.Linq;
    using System.Net;
    using Domain;
    using Nancy;
    using Nancy.Helpers;
    using Raven.Client;

    public class Authorization : IAuthorization
    {
        private const string AuthorizationCookie = "VoteAuth";
        private readonly IDocumentStore _documentStore;
        private readonly ICookieHasher _cookieHasher;

        public Authorization(IDocumentStore documentStore, ICookieHasher cookieHasher)
        {
            _documentStore = documentStore;
            _cookieHasher = cookieHasher;
        }

        public User GetAuthorizedUser(Request request) 
        { 
            using (var documentSession = _documentStore.OpenSession())
            {
                var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie).Value;
                authorizationCookie = HttpUtility.UrlDecode(authorizationCookie);

                if (authorizationCookie == null)
                {
                    return null;
                }

                var userId = int.Parse(_cookieHasher.Decode(authorizationCookie));
                var user = documentSession.Load<User>(userId);

                return user;
            }
        }
    }
}
