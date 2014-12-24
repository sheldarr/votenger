namespace Votenger.Infrastructure.Repositories
{
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

        public string GetUserNickname(int id)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                return documentSession.Load<User>(id).Nickname;
            }
        }

        public void CreateUserIfNotExists(string nickname)
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var existingUser = documentSession.Query<User>().FirstOrDefault(u => u.Nickname == nickname);

                if (existingUser != null)
                {
                    return;
                }

                var newUser = new User
                {
                    Nickname = nickname,
                    DraftResponses = new List<DraftResponse>()
                };

                documentSession.Store(newUser);
                documentSession.SaveChanges();
            }
        }
    }
}
