namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.IO;
    using System.Linq;
    using Authorization;
    using Domain;
    using Domain.Game;
    using Domain.Response;
    using Domain.Session;
    using Newtonsoft.Json;
    using Raven.Client;
    using Raven.Client.Linq;

    public class RavenInitalizer : IRavenInitalizer
    {
        private readonly IDocumentStore _documentStore;
        private readonly ICookieHasher _cookieHasher;

        public RavenInitalizer(IDocumentStore documentStore, ICookieHasher cookieHasher)
        {
            _documentStore = documentStore;
            _cookieHasher = cookieHasher;
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
                    var gamesFromFile = JsonConvert.DeserializeObject<ICollection<Game>>(fileContent);
                    var gamesInDatabase = documentSession.Query<Game>().ToList();

                    var gamesToAdd = gamesFromFile.Where(g => gamesInDatabase.All(ga => ga.Name != g.Name)).ToList();

                    foreach (var game in gamesToAdd)
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
                    Login = "Sheldar",
                    PasswordHash = _cookieHasher.Encode("uberboss")
                };

                documentSession.Store(rootUser);
                documentSession.SaveChanges();
            }
        }
    }
}
