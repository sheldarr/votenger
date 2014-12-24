namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using Domain.Game;
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
                        Id = 1,
                        Status = VotingSessionStatus.InProgess,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(2)
                    },
                    new VotingSession
                    {
                        Id = 2,
                        Status = VotingSessionStatus.Completed,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(1)
                    }
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
    }
}
