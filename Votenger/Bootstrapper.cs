namespace Votenger
{
    using Infrastructure;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Bootstrapper;
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

            container.Register<IGameRepository, GameRepository>().AsSingleton();

            var embeddableDocumentStore = new EmbeddableDocumentStore
            {
                DataDirectory = "Data"
                //RunInMemory = true
            };

            embeddableDocumentStore.Initialize();

            var ravenInitializer = new RavenInitalizer(embeddableDocumentStore);
            //ravenInitializer.SeedWithUsers();
            //ravenInitializer.SeedWithVotingSessions();
            ravenInitializer.SeedWithGames();
            
            container.Register<IDocumentStore>(embeddableDocumentStore);
        }
    }
}