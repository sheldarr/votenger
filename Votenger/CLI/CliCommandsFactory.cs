namespace Votenger.CLI
{
    using Commands;
    using Infrastructure.Repositories;
    using Nancy.Json;

    public class CliCommandsFactory
    {
        private readonly IUserRepository _userRepository;
        private readonly IVoteObjectRepository _voteObjectRepository;
        private readonly IVotingSessionRepository _votingSessionRepository;

        private readonly JavaScriptSerializer _javaScriptSerializer;

        public CliCommandsFactory(IUserRepository userRepository, IVoteObjectRepository voteObjectRepository, IVotingSessionRepository votingSessionRepository, JavaScriptSerializer javaScriptSerializer)
        {
            _userRepository = userRepository;
            _voteObjectRepository = voteObjectRepository;
            _votingSessionRepository = votingSessionRepository;
            _javaScriptSerializer = javaScriptSerializer;
        }

        public ICliCommand CreateCilCommand(string command)
        {
            switch (command.ToLower())
            {
                case "exit":
                    return new ExitApplicationCliCommand();

                case "backup":
                    return new BackupCliCommand(_userRepository, _voteObjectRepository, _votingSessionRepository, _javaScriptSerializer);

                case "version":
                    return new DisplayVersionCliCommand();

                default:
                    return new ParserErrorCliCommand();
            }
        }
    }
}
