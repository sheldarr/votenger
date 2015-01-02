namespace Votenger.Infrastructure.Authorization
{
    public interface ICookieHasher
    {
        string Encode(string data);
        string Decode(string data);
    }
}
