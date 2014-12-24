namespace Votenger.Infrastructure.Repositories
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Domain;
    using Domain.Response;
    using Raven.Client;

    public class UserRepository : IUserRepository
    {
        private readonly IDocumentStore _documentStore;

        public UserRepository(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public string GetUserNickname(string hash)
        {
            if (string.IsNullOrEmpty(hash))
            {
                return String.Empty;
            }

            using (var documentSession = _documentStore.OpenSession())
            {
                var user = documentSession.Query<User>()
                    .Customize(x => x.WaitForNonStaleResults(TimeSpan.FromSeconds(10)))
                    .FirstOrDefault(u => u.Hash == hash);

                return user.Nickname ?? String.Empty;
            }
        }

        public User GetUser(string hash)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var user = documentSession.Query<User>().FirstOrDefault(u => u.Hash == hash);
                return user;
            }
        }

        public string CreateUserIfNotExists(string nickname)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var existingUser = documentSession.Query<User>().FirstOrDefault(u => u.Nickname == nickname);

                if (existingUser != null)
                {
                    return existingUser.Hash;
                }

                var newUser = new User
                {
                    Hash = Guid.NewGuid().ToString(),
                    Nickname = nickname,
                    DraftResponses = new List<DraftResponse>(),
                    VoteResponses = new List<VoteResponse>()
                };

                documentSession.Store(newUser);
                documentSession.SaveChanges();

                return newUser.Hash;
            }
        }
    }
}
