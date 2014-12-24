namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Domain;
    using Domain.Game;
    using Domain.Response;
    using Domain.Session;
    using Newtonsoft.Json;
    using Raven.Client;

    public class RavenInitalizer : IRavenInitalizer
    {
        private readonly IDocumentStore _documentStore;

        public RavenInitalizer(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        }

        public void SeedWithVotingSessions()
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var votingSessions = new List<VotingSession>
                {
                    new VotingSession
                    {
                        Status = VotingSessionStatus.Draft,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(2)
                    },
                    new VotingSession
                    {
                        Status = VotingSessionStatus.Vote,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(1)
                    },
                     new VotingSession
                    {
                        Status = VotingSessionStatus.Completed,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(2)
                    },
                };

                foreach (var votingSession in votingSessions)
                {
                    documentSession.Store(votingSession);
                }

                documentSession.SaveChanges();
            }
        }

        public void SeedWithGames()
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var path = String.Format("{0}/Resources/Games.json", AppDomain.CurrentDomain.BaseDirectory);

                using (var streamReader = new StreamReader(path))
                {
                    var fileContent = streamReader.ReadToEnd();
                    var allGames = JsonConvert.DeserializeObject<ICollection<Game>>(fileContent);

                    foreach (var game in allGames)
                    {
                        documentSession.Store(game);
                    }
                }

                documentSession.SaveChanges();
            }
        }

        public void SeedWithUsers()
        {
            using (var documentSession = _documentStore.OpenSession())
            {
                var rootUser = new User
                {
                    Hash = "uberboss",
                    Nickname = "Sheldar",
                    DraftResponses = new List<DraftResponse>(),
                    VoteResponses = new List<VoteResponse>()
                };

                documentSession.Store(rootUser);
                documentSession.SaveChanges();
            }
        }
    }
}
