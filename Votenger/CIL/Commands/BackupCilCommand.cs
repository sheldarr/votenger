namespace Votenger.CIL.Commands
{
    using System;
    using System.IO;
    using Infrastructure.Repositories;
    using Nancy.Json;
    using Nancy.TinyIoc;

    public class BackupCilCommand : ICilCommand
    {
        private readonly IUserRepository _userRepository;
        private readonly IVoteObjectRepository _voteObjectRepository;
        private readonly IVotingSessionRepository _votingSessionRepository;

        private readonly JavaScriptSerializer _javaScriptSerializer;

        public BackupCilCommand()
        {
            _userRepository = TinyIoCContainer.Current.Resolve<UserRepository>();
            _voteObjectRepository = TinyIoCContainer.Current.Resolve<VoteObjectRepository>();
            _votingSessionRepository = TinyIoCContainer.Current.Resolve<VotingSessionRepository>();

            _javaScriptSerializer = new JavaScriptSerializer();
        }

        public void Execute()
        {
            Console.WriteLine("Backup started");

            var allUsers = _userRepository.GetAllUsers();
            var allVoteObjects = _voteObjectRepository.GetAllVoteObjects();
            var allVotingSessions = _votingSessionRepository.GetAllVotingSessions();

            var usersBackupPath = String.Format("{0}/Backup/users_{1}", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now);
            var voteObjectsBackupPath = String.Format("{0}/Backup/voteObjects_{1}", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now);
            var votingSessionsBackupPath = String.Format("{0}/Backup/votingSessions_{1}", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now);

            using (var streamWriter = new StreamWriter(usersBackupPath))
            {

                var allUsersJson = _javaScriptSerializer.Serialize(allUsers);

                streamWriter.Write(allUsersJson);
            }

            using (var streamWriter = new StreamWriter(voteObjectsBackupPath))
            {

                var allVoteObjectsJson = _javaScriptSerializer.Serialize(allVoteObjects);

                streamWriter.Write(allVoteObjectsJson);
            }

            using (var streamWriter = new StreamWriter(votingSessionsBackupPath))
            {

                var allVotingSessionsJson = _javaScriptSerializer.Serialize(allVotingSessions);

                streamWriter.Write(allVotingSessionsJson);
            }

            Console.WriteLine("Backup finished");
        }
    }
}
