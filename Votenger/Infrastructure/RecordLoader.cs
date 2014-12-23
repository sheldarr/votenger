namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Data;
    using Domain.Session;
    using Newtonsoft.Json;

    public class RecordLoader : IRecordLoader
    {
        public ICollection<Session> GetAllSessions(string fileName)
        {
            return new List<Session>
            {
                new Session
                {
                    Id = 1,
                    SessionStatus = SessionStatus.InProgess,
                    SessionType = SessionType.Computer,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(2)
                },
                new Session
                {
                    Id = 2,
                    SessionStatus = SessionStatus.Completed,
                    SessionType = SessionType.Computer,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(1)
                }
            };
        }

        public ICollection<GameRecord> GetAllComputerGames(string fileName)
        {
            var path = String.Format("{0}/Resources/{1}.json", AppDomain.CurrentDomain.BaseDirectory, fileName);

            using (var streamReader = new StreamReader(path))
            {
                var fileContent = streamReader.ReadToEnd();
                //var allGames = JsonConvert.DeserializeObject<ICollection<GameRecord>>(fileContent);
                //var computerGames = allGames.Where(g => g.Type == GameType.ComputerGame).ToList();
                var computerGames = new List<GameRecord> { new GameRecord { Name = "Dupa",Type = GameType.ComputerGame}};
                return computerGames;
            }
        }

        public ICollection<GameRecord> GetAllBoardGames(string fileName)
        {
            var path = String.Format("{0}/Resources/{1}.json", AppDomain.CurrentDomain.BaseDirectory, fileName);

            using (var streamReader = new StreamReader(path))
            {
                var fileContent = streamReader.ReadToEnd();
                var allGames = JsonConvert.DeserializeObject<ICollection<GameRecord>>(fileContent);
                var computerGames = allGames.Where(g => g.Type == GameType.BoardGame).ToList();

                return computerGames;
            }
        }
    }
}
