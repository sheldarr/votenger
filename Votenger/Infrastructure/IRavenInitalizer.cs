namespace Votenger.Infrastructure
{
    public interface IRavenInitalizer
    {
        void SeedWithVotingSessions();
        void SeedWithGames();        
    }
}
