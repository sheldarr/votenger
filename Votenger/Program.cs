namespace Votenger
{
    using System;
    using CLI;
    using Nancy.Hosting.Self;

    class Program
    {
        static void Main(string[] args)
        {
            var uri = new Uri("http://localhost:6699");

            var hostConfiguration = new HostConfiguration
            {
                UrlReservations = new UrlReservations { CreateAutomatically = true }
            };

            using (var host = new NancyHost(hostConfiguration, uri))
            {
                host.Start();

                CommandLineInterface.Start(uri.AbsoluteUri);
            }
        }
    }
}
