namespace Votenger.Infrastructure.Authorization
{
    using System.Security.Cryptography;
    using System.Text;

    public class Sha1PasswordHasher : IPasswordHasher
    {
        private readonly SHA1CryptoServiceProvider _sha1CryptoServiceProvider;

        public Sha1PasswordHasher(SHA1CryptoServiceProvider sha1CryptoServiceProvider)
        {
            _sha1CryptoServiceProvider = sha1CryptoServiceProvider;
        }

        public string HashPassword(string password)
        {
            var data = Encoding.ASCII.GetBytes(password);

            var sha1Data = _sha1CryptoServiceProvider.ComputeHash(data);

            var hashedPassword = Encoding.UTF8.GetString(sha1Data);

            return hashedPassword;
        }
    }
}
