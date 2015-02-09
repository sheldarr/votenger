namespace Votenger.CLI
{
    using System;

    public class CliEngine
    {
        private readonly CliCommandsFactory _cliCommandsFactory;

        public CliEngine(CliCommandsFactory cliCommandsFactory)
        {
            _cliCommandsFactory = cliCommandsFactory;
        }

        public void Run()
        {
            while (true)
            {
                var input = Console.ReadLine();

                var cilCommand = _cliCommandsFactory.CreateCilCommand(input);

                cilCommand.Execute();
            }
        }
    }
}
