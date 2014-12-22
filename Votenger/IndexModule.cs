namespace Votenger
{
    using Data;
    using Models;
    using Nancy;

    public class IndexModule : NancyModule
    {
        public IndexModule()
        {
            var recordLoader = new RecordLoader();
            var computerGamesModel = new ComputerGamesModel
            {
                GameRecords = recordLoader.GetAllComputerGames("Games")
            };

            Get["/"] = parameters => View["index", computerGamesModel];
        }
    }
}