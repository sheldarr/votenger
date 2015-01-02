namespace Votenger.Infrastructure.Authorization
{
    public class Base64Hasher : ICookieHasher
    {
        public string Encode(string data)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(data);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public string Decode(string data)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(data);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
