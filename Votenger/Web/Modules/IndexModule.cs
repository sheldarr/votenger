namespace Votenger
{
    using Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;
    using Web.Models;

    public class IndexModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IUserRepository _userRepository;

        public IndexModule(IAuthorization authorization, IUserRepository userRepository)
        {
            _authorization = authorization;
            _userRepository = userRepository;

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
                
                _userRepository.CreateUserIfNotExists(signInModel.Nickname);

                return Response.AsRedirect("/").WithCookie(voteAuthCookie);
            };
        }
    }
}