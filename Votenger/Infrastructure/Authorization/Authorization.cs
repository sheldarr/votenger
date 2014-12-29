namespace Votenger.Infrastructure.Authorization
{
    using System;
    using System.Linq;
    using Domain;
    using Nancy;
    using Raven.Client;

    public class Authorization : IAuthorization
    {
        private const string AuthorizationCookie = "VoteAuth";
        private readonly IDocumentStore _documentStore;

        public Authorization(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public User GetAuthorizedUser(Request request) 
        { 
            using (var documentSession = _documentStore.OpenSession())
            {
                var authorizationCookie = request.Cookies.FirstOrDefault(c => c.Key == AuthorizationCookie).Value;

                if (authorizationCookie == null)
                {
                    return null;
                }

                var userId = int.Parse(authorizationCookie)/1024;
                var user = documentSession.Load<User>(userId);

                return user;
            }
        }
    }
}
