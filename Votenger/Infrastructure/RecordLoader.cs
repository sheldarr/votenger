namespace Votenger.Data
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Newtonsoft.Json;

    public class RecordLoader : IRecordLoader
    {
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
