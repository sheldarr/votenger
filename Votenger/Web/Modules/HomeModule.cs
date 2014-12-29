namespace Votenger.Web.Modules
{
    using System;
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
                var authorizedUser = _authorization.GetAuthorizedUser(Request);
                var isAuthorized = authorizedUser != null;
                var nickname = isAuthorized ? authorizedUser.Nickname : String.Empty;

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