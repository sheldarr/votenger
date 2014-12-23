namespace Votenger.Infrastructure
{
    using System;
    using Nancy;

    class SelfHostingRootPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            var rootPath = AppDomain.CurrentDomain.BaseDirectory + @"Web";
            return rootPath;
        }
    }
}
