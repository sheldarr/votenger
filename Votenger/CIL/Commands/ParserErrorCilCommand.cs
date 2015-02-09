namespace Votenger.CIL.Commands
{
    using System;

    public class ParserErrorCilCommand : ICilCommand
    {
        public void Execute()
        {
            Console.WriteLine("Parser error.");
        }
    }
}
