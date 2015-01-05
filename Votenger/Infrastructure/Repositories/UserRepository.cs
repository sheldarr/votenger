namespace Votenger.Infrastructure.Repositories
{
    using System;
    using System.Linq;
    using Authorization;
    using Domain;
    using Raven.Client;
    using Web.DTO;

    public class UserRepository : IUserRepository
    {
        private readonly IDocumentStore _documentStore;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ICookieHasher _cookieHasher;

        public UserRepository(IDocumentStore documentStore, IPasswordHasher passwordHasher, ICookieHasher cookieHasher)
        {
            _documentStore = documentStore;
            _passwordHasher = passwordHasher;
            _cookieHasher = cookieHasher;
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
                    .FirstOrDefault(u => u.Id == int.Parse(_cookieHasher.Decode(hash)));

                return user.Login ?? String.Empty;
            }
        }

        public User GetUser(string hash)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var user = documentSession.Query<User>()
                    .Customize(x => x.WaitForNonStaleResults(TimeSpan.FromSeconds(10)))
                    .FirstOrDefault(u => u.Id == int.Parse(_cookieHasher.Decode(hash)));
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

        public string LoginOrCreateUserIfNotExists(UserCredentialsDto userCredentials)
        {
            var passwordHash = _passwordHasher.HashPassword(userCredentials.Password);
            using (var documentSession = _documentStore.OpenSession())
            {
                var existingUser = documentSession.Query<User>().FirstOrDefault(u => u.Login == userCredentials.Login);

                if (existingUser != null)
                {
                    if (existingUser.PasswordHash == passwordHash)
                    {
                        return _cookieHasher.Encode(existingUser.Id.ToString());
                    }

                    return String.Empty;
                }

                var newUser = new User
                {
                    Login = userCredentials.Login,
                    PasswordHash = passwordHash
                };

                documentSession.Store(newUser);
                documentSession.SaveChanges();

                existingUser = documentSession.Query<User>()
                    .Customize(x => x.WaitForNonStaleResults(TimeSpan.FromSeconds(10)))
                    .FirstOrDefault(u => u.Login == userCredentials.Login);

                return _cookieHasher.Encode(existingUser.Id.ToString());
            }
        }
    }
}
