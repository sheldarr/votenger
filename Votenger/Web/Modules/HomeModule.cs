namespace Votenger.Web.Modules
{
    using Nancy;

    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = parameters => View["home"];
        }
    }
}