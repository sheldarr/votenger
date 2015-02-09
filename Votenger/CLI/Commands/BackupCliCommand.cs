namespace Votenger.CLI.Commands
{
    using System;
    using System.IO;
    using Infrastructure.Repositories;
    using Nancy.Json;

    public class BackupCliCommand : ICliCommand
    {
        private readonly IUserRepository _userRepository;
        private readonly IVoteObjectRepository _voteObjectRepository;
        private readonly IVotingSessionRepository _votingSessionRepository;

        private readonly JavaScriptSerializer _javaScriptSerializer;

        public BackupCliCommand(IUserRepository userRepository, IVoteObjectRepository voteObjectRepository, IVotingSessionRepository votingSessionRepository, JavaScriptSerializer javaScriptSerializer)
        {
            _userRepository = userRepository;
            _voteObjectRepository = voteObjectRepository;
            _votingSessionRepository = votingSessionRepository;
            _javaScriptSerializer = javaScriptSerializer;
        }

        public void Execute()
        {
            Console.Write("Backup...");

            var allUsers = _userRepository.GetAllUsers();
            var allVoteObjects = _voteObjectRepository.GetAllVoteObjects();
            var allVotingSessions = _votingSessionRepository.GetAllVotingSessions();

            var usersBackupPath = String.Format("{0}\\Backup\\users_{1}.json", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmss"));
            var voteObjectsBackupPath = String.Format("{0}\\Backup\\voteObjects_{1}.json", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmss"));
            var votingSessionsBackupPath = String.Format("{0}\\Backup\\votingSessions_{1}.json", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now.ToString("yyyyMMdd_HHmmss"));

            var backupDirectory = String.Format("{0}\\Backup", AppDomain.CurrentDomain.BaseDirectory);
            Directory.CreateDirectory(backupDirectory);

            using (var streamWriter = File.AppendText(usersBackupPath))
            {

                var allUsersJson = _javaScriptSerializer.Serialize(allUsers);

                streamWriter.Write(allUsersJson);
            }

            using (var streamWriter = File.AppendText(voteObjectsBackupPath))
            {

                var allVoteObjectsJson = _javaScriptSerializer.Serialize(allVoteObjects);

                streamWriter.Write(allVoteObjectsJson);
            }

            using (var streamWriter = File.AppendText(votingSessionsBackupPath))
            {

                var allVotingSessionsJson = _javaScriptSerializer.Serialize(allVotingSessions);

                streamWriter.Write(allVotingSessionsJson);
            }

            Console.WriteLine("[OK]");
        }
    }
}
