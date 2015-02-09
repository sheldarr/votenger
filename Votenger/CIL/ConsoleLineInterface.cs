namespace Votenger.CIL
{
    using System;

    public class ConsoleLineInterface
    {
        public void Start(string uri)
        {
            Console.WriteLine("Your application is running on " + uri);
            Console.WriteLine("Type exit to close the host.");

            while (true)
            {
                var input = Console.ReadLine();

                var cilCommand = CilCommandsFactory.CreateCilCommand(input);

                cilCommand.Execute();
            }
        }

        public void BackupAll()
        {
        }
    }
}
