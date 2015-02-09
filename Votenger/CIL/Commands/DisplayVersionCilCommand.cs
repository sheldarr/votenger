namespace Votenger.CIL.Commands
{
    using System;

    public class DisplayVersionCilCommand : ICilCommand
    {
        public void Execute()
        {
            Console.WriteLine("Votenger version 2.0");
        }
    }
}
