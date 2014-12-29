namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
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
            ICollection<DraftResult> draftResults = new List<DraftResult>();
            ICollection<VoteResult> voteResults = new List<VoteResult>();

            draftResults.Add(new DraftResult
            {
                SelectedGames = new List<int> { 1, 2, 3, 4, 5, 6 }
            });

            voteResults.Add(new VoteResult
            {
                Id = 1,
                MustPlayGame = 1,
                MustNotPlayGame = 2,
                ThreePointsGame = 3,
                TwoPointsGame = 4,
                OnePointGame = 5
            });

            using (var documentSession = _documentStore.OpenSession())
            {
                var rootUser = documentSession.Load<User>(1);
                var votingSessions = new List<VotingSession>
                {
                    new VotingSession
                    {
                        Author = rootUser,
                        Status = VotingSessionStatus.Draft,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(2),
                        DraftResults = draftResults,
                        VoteResults = voteResults
                    },
                    new VotingSession
                    {
                        Author = rootUser,
                        Status = VotingSessionStatus.Vote,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(1),
                        DraftResults = draftResults,
                        VoteResults = voteResults
                    },
                     new VotingSession
                    {
                        Author = rootUser,
                        Status = VotingSessionStatus.Completed,
                        Type = VotingSessionType.Computer,
                        StartDate = DateTime.Now,
                        EndDate = DateTime.Now.AddDays(2),
                        DraftResults = draftResults,
                        VoteResults = voteResults
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
                    Id = 1,
                    Hash = "uberboss",
                    Nickname = "Sheldar",
                };

                documentSession.Store(rootUser);
                documentSession.SaveChanges();
            }
        }
    }
}
