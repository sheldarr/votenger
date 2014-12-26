﻿namespace Votenger
{
    using Infrastructure.Authorization;
    using Infrastructure.Repositories;
    using Nancy;
    using Nancy.Cookies;
    using Nancy.ModelBinding;
    using Web.Models;
    using HttpStatusCode = System.Net.HttpStatusCode;

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
                var userId = _authorization.DecodeUserHash(Request);
                var nickname = _userRepository.GetUserNickname(userId);

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
                
                var userGuid = _userRepository.CreateUserIfNotExists(signInModel.Nickname);

                var voteAuthCookie = new NancyCookie("VoteAuth", userGuid);

                return  Response.AsJson("").WithCookie(voteAuthCookie);
            };
        }
    }
}