namespace Votenger.Web.Modules
{
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;
    using Models;

    public class HomeModule : NancyModule
    {
        private readonly IAuthorization _authorization;
        private readonly IUserRepository _userRepository;

        public HomeModule(IAuthorization authorization, IUserRepository userRepository)
        {
            _authorization = authorization;
            _userRepository = userRepository;

            Get["/"] = parameters =>
            {
                var isAuthorized = _authorization.CheckIfAuthorized(Request);
                var userId = _authorization.DecodeUserHash(Request);
                var nickname = _userRepository.GetUserNickname(userId);

                var indexModel = new HomeModel
                {
                    IsAuthorized = isAuthorized,
                    Nickname = nickname,
                };

                return View["home", indexModel];
            };

            Post["/signIn"] = parameters =>
            {
                var signInModel = this.Bind<SignInModel>();
                
                var userGuid = _userRepository.CreateUserIfNotExists(signInModel.Nickname);

                var voteAuthCookie = new NancyCookie("VoteAuth", userGuid);

                return  Response.AsJson("").WithCookie(voteAuthCookie);
            };
        }
    }
}