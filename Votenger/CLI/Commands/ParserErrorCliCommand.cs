namespace Votenger.CLI.Commands
{
    using System;

    public class ParserErrorCliCommand : ICliCommand
    {
        public void Execute()
        {
            Console.WriteLine("Parser error.");
        }
    }
}
