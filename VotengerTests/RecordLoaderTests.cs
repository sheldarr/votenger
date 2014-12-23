namespace VotengerTests
{
    using System.Linq;
    using NUnit.Framework;
    using Votenger.Data;
    using Votenger.Infrastructure;

    [TestFixture]
    internal class RecordLoaderTests
    {
        [Test]
        public void ShouldProperlyDeserializeComputerGames()
        {
            //given
            var recordLoader = new RecordLoader();
           
            //when
            var computerGames = recordLoader.GetAllComputerGames("TestGames");

            //then
            Assert.That(computerGames.Count, Is.EqualTo(2));
            Assert.That(computerGames.FirstOrDefault().Name, Is.EqualTo("Test Computer Game A"));
            Assert.That(computerGames.FirstOrDefault().Type, Is.EqualTo(GameType.ComputerGame));
            Assert.That(computerGames.ElementAt(1).Name, Is.EqualTo("Test Computer Game B"));
            Assert.That(computerGames.ElementAt(1).Type, Is.EqualTo(GameType.ComputerGame));
        }

        [Test]
        public void ShouldProperlyDeserializeBoardGames()
        {
            //given
            var recordLoader = new RecordLoader();

            //when
            var computerGames = recordLoader.GetAllBoardGames("TestGames");

            //then
            Assert.That(computerGames.Count, Is.EqualTo(2));
            Assert.That(computerGames.FirstOrDefault().Name, Is.EqualTo("Test Board Game A"));
            Assert.That(computerGames.FirstOrDefault().Type, Is.EqualTo(GameType.BoardGame));
            Assert.That(computerGames.ElementAt(1).Name, Is.EqualTo("Test Board Game B"));
            Assert.That(computerGames.ElementAt(1).Type, Is.EqualTo(GameType.BoardGame));
        }
    }
}
