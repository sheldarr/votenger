namespace Votenger.Infrastructure
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using Domain.VoteObject;
    using Newtonsoft.Json;
    using Raven.Client;

    public class RavenDataLoader : IRavenDataLoader
    {
        private readonly IDocumentStore _documentStore;

        public RavenDataLoader(IDocumentStore documentStore)
        {
            _documentStore = documentStore;
        } 

        public void LoadVoteObjects()
        {
            var filesPath = String.Format("{0}/Resources/", AppDomain.CurrentDomain.BaseDirectory);
            var filesToLoad = Directory.GetFiles(filesPath, "*.json");

            foreach (var fileToLoad in filesToLoad)
            {
                try
                {
                    LoadVoteObjectFromFile(fileToLoad);
                }
                catch (Exception e)
                {
                    var errorMessage = String.Format("Exception: {0}", e.Message);
                    Console.WriteLine(errorMessage);
                }
            }
        }

        public void LoadVoteObjectFromFile(string path)
        {
            var startLoadMessage = String.Format("Started loading vote objects from file: {0}", path);
            Console.WriteLine(startLoadMessage);

            using (var documentSession = _documentStore.OpenSession())
            {
                using (var streamReader = new StreamReader(path))
                {
                    var fileContent = streamReader.ReadToEnd();
                    var voteObjectsFromFile = JsonConvert.DeserializeObject<ICollection<VoteObject>>(fileContent);
                    var voteObjectsInDatabase = documentSession.Query<VoteObject>().ToList();

                    var voteObjectsToAdd = voteObjectsFromFile.Where(g => voteObjectsInDatabase.All(ga => ga.Name != g.Name)).ToList();

                    foreach (var voteObject in voteObjectsToAdd)
                    {
                        documentSession.Store(voteObject);
                    }

                    var finishLoadMessage = String.Format("Finished loading vote objects from file: {0}/{1}", voteObjectsToAdd.Count, voteObjectsFromFile.Count);
                    Console.WriteLine(finishLoadMessage);
                }

                documentSession.SaveChanges();
            }
        }
    }
}
