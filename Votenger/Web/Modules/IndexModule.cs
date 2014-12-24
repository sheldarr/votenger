namespace Votenger
{
    using Authorization;
    using Models;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;

    public class IndexModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        public IndexModule(IAuthorization authorization)
        {
            _authorization = authorization;

            Get["/"] = parameters =>
            {
                var isAuthorized = _authorization.CheckIfAuthorized(Request);
                var nickname = _authorization.DecodeNickname(Request);

                var indexModel = new IndexModel
                {
                    IsAuthorized = isAuthorized,
                    Nickname = nickname,
                };

                return View["index", indexModel];
            };

            Post["/signIn"] = parameters =>
            {
                var signInModel = this.Bind<SignInModel>();         
                var voteAuthCookie = new NancyCookie("VoteAuth", signInModel.Nickname);

                return Response.AsRedirect("/").WithCookie(voteAuthCookie);
            };
        }
    }
}