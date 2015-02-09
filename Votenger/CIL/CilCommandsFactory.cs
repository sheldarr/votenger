namespace Votenger.CIL
{
    using Commands;

    public static class CilCommandsFactory
    {
        public static ICilCommand CreateCilCommand(string command)
        {
            switch (command.ToLower())
            {
                case "exit":
                    return new ExitApplicationCilCommand();

                case "backup":
                    return new BackupCilCommand();

                case "version":
                    return new DisplayVersionCilCommand();

                default:
                    return new ParserErrorCilCommand();
            }
        }
    }
}
