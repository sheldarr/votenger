namespace Votenger.CLI
{
    using System;

    public static class CommandLineInterface
    {
        private static CliEngine _cliEngine;

        public static void SetCliEngine(CliEngine cliEngine)
        {
            if (_cliEngine != null)
            {
                return;
            }

            _cliEngine = cliEngine;
        }

        public static void Start(string uri)
        {
            Console.WriteLine("Your application is running on " + uri);
            Console.WriteLine("Type exit to close the host.");

           _cliEngine.Run();
        }
    }
}
