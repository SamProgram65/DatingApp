using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);

        Task<AppUser> GetUSerWithLikes(int userId);

        Task<PagedList<LikedDto>> GetUserLikes(LikesParams likesParams);
    }
}