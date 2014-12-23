namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Data;
    using Domain;
    using Domain.Session;
    using Newtonsoft.Json;

    public class RecordLoader : IRecordLoader
    {
        public ICollection<VotingSession> GetAllSessions(string fileName)
        {
            return new List<VotingSession>
            {
                new VotingSession
                {
                    Id = 1,
                    VotingSessionStatus = VotingSessionStatus.InProgess,
                    VotingSessionType = VotingSessionType.Computer,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(2)
                },
                new VotingSession
                {
                    Id = 2,
                    VotingSessionStatus = VotingSessionStatus.Completed,
                    VotingSessionType = VotingSessionType.Computer,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(1)
                }
            };
        }

        public ICollection<Game> GetAllComputerGames(string fileName)
        {
            var path = String.Format("{0}/Resources/{1}.json", AppDomain.CurrentDomain.BaseDirectory, fileName);

            using (var streamReader = new StreamReader(path))
            {
                var fileContent = streamReader.ReadToEnd();
                //var allGames = JsonConvert.DeserializeObject<ICollection<Game>>(fileContent);
                //var computerGames = allGames.Where(g => g.Type == GameType.ComputerGame).ToList();
                var computerGames = new List<Game> { new Game { Name = "Dupa",Type = GameType.ComputerGame}};
                return computerGames;
            }
        }

        public ICollection<Game> GetAllBoardGames(string fileName)
        {
            var path = String.Format("{0}/Resources/{1}.json", AppDomain.CurrentDomain.BaseDirectory, fileName);

            using (var streamReader = new StreamReader(path))
            {
                var fileContent = streamReader.ReadToEnd();
                var allGames = JsonConvert.DeserializeObject<ICollection<Game>>(fileContent);
                var computerGames = allGames.Where(g => g.Type == GameType.BoardGame).ToList();

                return computerGames;
            }
        }
    }
}
