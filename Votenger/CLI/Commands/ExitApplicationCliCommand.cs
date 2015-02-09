namespace Votenger.CLI.Commands
{
    public class ExitApplicationCliCommand : ICliCommand
    {
        public void Execute()
        {
            System.Environment.Exit(0);
        }
    }
}
