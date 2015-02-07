namespace VotengerTests
{
    using System.Linq;
    using NUnit.Framework;
    using Votenger.Domain;
    using Votenger.Domain.Game;
    using Votenger.Infrastructure;

    [TestFixture]
    internal class RecordLoaderTests
    {
        [Test]
        public void ShouldProperlyDeserializeComputerGames()
        {
            ////given
            //var recordLoader = new RavenInitalizer();
           
            ////when
            //var computerGames = recordLoader.GetAllComputerGames("TestGames");

            ////then
            //Assert.That(computerGames.Count, Is.EqualTo(2));
            //Assert.That(computerGames.FirstOrDefault().Name, Is.EqualTo("Test Computer VoteObject A"));
            //Assert.That(computerGames.FirstOrDefault().Type, Is.EqualTo(GameType.ComputerGame));
            //Assert.That(computerGames.ElementAt(1).Name, Is.EqualTo("Test Computer VoteObject B"));
            //Assert.That(computerGames.ElementAt(1).Type, Is.EqualTo(GameType.ComputerGame));
        }

        [Test]
        public void ShouldProperlyDeserializeBoardGames()
        {
            ////given
            //var recordLoader = new RavenInitalizer();

            ////when
            //var computerGames = recordLoader.GetAllBoardGames("TestGames");

            ////then
            //Assert.That(computerGames.Count, Is.EqualTo(2));
            //Assert.That(computerGames.FirstOrDefault().Name, Is.EqualTo("Test Board VoteObject A"));
            //Assert.That(computerGames.FirstOrDefault().Type, Is.EqualTo(GameType.BoardGame));
            //Assert.That(computerGames.ElementAt(1).Name, Is.EqualTo("Test Board VoteObject B"));
            //Assert.That(computerGames.ElementAt(1).Type, Is.EqualTo(GameType.BoardGame));
        }
    }
}
