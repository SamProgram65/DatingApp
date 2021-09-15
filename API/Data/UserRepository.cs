using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext __context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            __context = context;


        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
           return await __context.Users
             .Where(x => x.UserName == username)
             .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public Task<MemberDto> GetMemberAsync()
        {
            throw new System.NotImplementedException();
        }

        // public Task<MemberDto> GetMembersAsync()
        // {
        //     throw new System.NotImplementedException();
        // }

        public async Task<PagedList<MemberDto>> GetMembersAync(UserParams userParams)
        {
         var query = __context.Users.AsQueryable();
            
             query = query.Where(u => u.UserName != userParams.CurrentUsername);
             query = query.Where(u => u.Gender == userParams.Gender);

             var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
             var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

             query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
             
             query = userParams.OrderBy switch
             {
                 "created" => query.OrderByDescending(u => u.Created),
                 _ => query.OrderByDescending(u => u.LastActive)
             };
          return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>
          (_mapper.ConfigurationProvider).AsNoTracking(),
           userParams.PageNumber, userParams.PageSize);   
        }

        public async Task<IEnumerable<AppUser>> GetUserAsync()
        {
            return await __context.Users
            .Include(p => p.Photos)
            .ToListAsync();
        }

        public async Task<AppUser> GetUSerByIdASync(int id)
        {
            return await __context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await __context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
        }


        // public Task<bool> SaveAllAsync()
        // {
        //     throw new System.NotImplementedException();
        // }

        // public async Task<bool> SaveAllAsync()
        // {
        //     return await __context.SaveChangesAsync() > 0;
        // }

        public void Update(AppUser user)
        {
            __context.Entry(user).State = EntityState.Modified;
        }
    }
}