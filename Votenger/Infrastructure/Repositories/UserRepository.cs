namespace Votenger.Infrastructure.Repositories
{
    using System;
    using System.Linq;
    using Domain;
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
                var user = documentSession.Query<User>()
                    .Customize(x => x.WaitForNonStaleResults(TimeSpan.FromSeconds(10)))
                    .FirstOrDefault(u => u.Hash == hash);
                return user;
            }
        }

        public User GetUser(int id)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var user = documentSession.Load<User>(id);
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
                };

                documentSession.Store(newUser);
                documentSession.SaveChanges();

                return newUser.Hash;
            }
        }
    }
}
