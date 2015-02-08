namespace Votenger
{
    using Infrastructure;
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Conventions;
    using Nancy.TinyIoc;
    using Raven.Client;
    using Raven.Client.Embedded;

    public class Bootstrapper : DefaultNancyBootstrapper
    {
        protected override IRootPathProvider RootPathProvider
        {
            get { return new SelfHostingRootPathProvider(); }
        }

        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory(@"/css", @"/Content/css"));
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("/js", @"/Content/js"));
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("/fonts", @"/Content/fonts"));
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("/images", @"/Content/images"));

            base.ConfigureConventions(nancyConventions);
        }

        protected override void ConfigureApplicationContainer(TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register<IVoteObjectRepository, VoteObjectRepository>().AsSingleton();
            container.Register<IUserRepository, UserRepository>().AsSingleton();
            container.Register<IPasswordHasher, Sha1PasswordHasher>();

            var embeddableDocumentStore = new EmbeddableDocumentStore
            {
                DataDirectory = "Data",
                RunInMemory = true
            };

            embeddableDocumentStore.Initialize();

            var ravenDataLoader = new RavenDataLoader(embeddableDocumentStore);

            ravenDataLoader.LoadVoteObjects();
            
            container.Register<IDocumentStore>(embeddableDocumentStore);
        }
    }
}