namespace Votenger.CLI.Commands
{
    using System;

    public class DisplayVersionCliCommand : ICliCommand
    {
        public void Execute()
        {
            Console.WriteLine("Votenger version 2.0");
        }
    }
}
