namespace Votenger.Infrastructure
{
    using System;
    using Nancy;

    class SelfHostingRootPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            var rootPath = String.Format("{0}Web", AppDomain.CurrentDomain.BaseDirectory);
            return rootPath;
        }
    }
}
