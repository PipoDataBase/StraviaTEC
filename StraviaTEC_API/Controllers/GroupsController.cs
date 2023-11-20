using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver.Core.Configuration;
using StraviaTEC_API.Models;

namespace StraviaTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly StraviaTecContext _context;
        private readonly string _connectionString;


        public GroupsController(StraviaTecContext context)
        {
            _context = context;
            _connectionString = "server=DESKTOP-VEB3CKO; database=StraviaTEC; integrated security=true; Encrypt=False;";
        }

        /**
        * Returns all the Groups of the database
        * @return Group[] list of groups
        */
        // GET: api/Groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
        {
            /*
          if (_context.Groups == null)
          {
              return NotFound();
          }
          return await _context.Groups.FromSqlRaw("EXEC spGetGroups").ToListAsync();
            */
            var connection = new SqlConnection(_connectionString);
            
                connection.Open();
                var group = await connection.QueryAsync<Group>("EXEC spGetGroups");
            return group.ToList();
            
        }

        /**
        * Return the Group with the given id
        */
        // GET: api/Groups/
        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetGroup(string id)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }

            var result = await _context.Groups.FromSqlRaw(
                    "EXEC spGetGroup @Name",
                    new SqlParameter("@Name", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Returns all the groups managed by the user with the given username
        * @param  username it is the id of the user you want to get the managed groups
        * @return Group[]
        */
        [HttpGet("ByManager/{username}")]
        public async Task<dynamic> GetGroupsByManager(string username)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            try
            {
                var result = await _context.Groups.FromSqlRaw(
                    "EXEC spGetGroupsByManager @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

                return Ok(result);
            }
            catch
            {
                throw;
            }
        }


        /**
        * Returns all the groups with a coindidences in the name of the given id
        * @param  id name of challenge you want to search for coincidences
        * @return Group[] list of groups
        */
        // GET: api/Groups/
        [HttpGet("Search/{id}")]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroupSearch(string id)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }

            var result = await _context.Groups.FromSqlRaw(
                    "EXEC spGetGroup @Name",
                    new SqlParameter("@Name", id)
                    ).ToListAsync();

            return result;
        }

        /**
        * Returns all the members of the group with the given id
        * @param  groupName name of group which you want to get its members
        * @return Sportman[] list of Sportman
        */
        [HttpGet("GetMembers/{groupName}")]
        public async Task<ActionResult<IEnumerable<Group>>> GetMembers(string groupName)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }

            var result = await _context.Groups.FromSqlRaw(
                    "EXEC spGetGroupMembers @GroupName",
                    new SqlParameter("@GroupName", groupName)
                    ).ToListAsync();

            return result;
        }



        /**
        * Creates a new group with the given name and sets its manager with the given username
        * @param  groupName name of Group you want to create
        * @return true if the creation successfull
        */
        // POST: api/Groups
        [HttpPost("{groupName}/{username}")]
        public async Task<ActionResult<Group>> PostGroup(string groupName, string username)
        {
            if (_context.Groups == null)
            {
                return Problem("Entity set 'StraviaTecContext.Groups'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertGroup @Name, @ManagerUsername",
                    new SqlParameter("@Name", groupName),
                    new SqlParameter("@ManagerUsername", username)
                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }


        /**
        * Give access to the given Group to participate and see the given Challenge
        * @param  challengeName name of challenge you want to give access to the group
        * @param groupName name of the group you want to give accesss to the callenge
        * @return true if the query was successful
        */
        // POST: api/Groups
        [HttpPost("AddToChallenge/{challengeName}/{groupName}")]
        public async Task<ActionResult<Group>> PostChallengeGroup(string challengeName, string groupName)
        {
            if (_context.Groups == null)
            {
                return Problem("Entity set 'StraviaTecContext.Groups'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spAddChallengeGroup @ChallengeName, @GroupName",
                    new SqlParameter("@ChallengeName", challengeName),
                    new SqlParameter("@GroupName", groupName)
                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Give access to the given Group to participate and see the given Race
        * @param  RaceName name of race you want to give access to the group
        * @param groupName name of the group you want to give accesss to the race
        * @return true if the query was successful
        */
        // POST: api/Groups
        [HttpPost("AddToRace/{raceName}/{groupName}")]
        public async Task<ActionResult<Group>> PostRaceGroup(string raceName, string groupName)
        {
            if (_context.Groups == null)
            {
                return Problem("Entity set 'StraviaTecContext.Groups'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spAddRaceGroup @RaceName, @GroupName",
                    new SqlParameter("@RaceName", raceName),
                    new SqlParameter("@GroupName", groupName)
                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the group with the given id
        * @param  id name of group you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/Groups/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(string id)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }
            var @group = await _context.Groups.FindAsync(id);
            if (@group == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteGroup @Name",
                new SqlParameter("@Name", id)
                );

            return Ok(true);
        }

        /**
        * Removes the access to a given Challenge from a given Group
        * @param  challengeName name of challenge you want to remove access from group
        * @param groupName name of the group you want to remove accesss to the callenge
        * @return true if the query was successful
        */
        // DELETE: api/Groups/
        [HttpDelete("LeaveChallenge/{challengeName}/{groupName}")]
        public async Task<IActionResult> DeleteChallengeGroup(string challengeName, string groupName)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spDeleteChallengeGroup @ChallengeName, @GroupName",
                    new SqlParameter("@ChallengeName", challengeName),
                    new SqlParameter("@GroupName", groupName)
                    );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        /**
        * Removes the access to a given Race from a given Group
        * @param  RaceName name of Race you want to remove access from group
        * @param groupName name of the group you want to remove accesss to the race
        * @return true if the query was successful
        */
        // DELETE: api/Groups/
        [HttpDelete("LeaveRace/{RaceName}/{groupName}")]
        public async Task<IActionResult> DeleteRaceGroup(string RaceName, string groupName)
        {
            if (_context.Groups == null)
            {
                return NotFound();
            }

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteRaceGroup @RaceName, @GroupName",
                new SqlParameter("@RaceName", RaceName),
                new SqlParameter("@GroupName", groupName)
                );

            return Ok(true);
        }

        private bool GroupExists(string id)
        {
            return (_context.Groups?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
