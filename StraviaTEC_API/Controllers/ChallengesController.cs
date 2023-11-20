using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StraviaTEC_API.Models;

namespace StraviaTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public ChallengesController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Return the all the Challenges in the database
        * @return Category[] list of categories
        */
        // GET: api/Challenges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Challenge>>> GetChallenges()
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            return await _context.Challenges.FromSqlRaw("spGetChallenges").ToListAsync();
        }

        /**
        * Return the visible/available challenges for the user according to the given username
        * @param  username it is the username of the user you want to get the available challenges
        * @return VwChallenge[] list of VwChallenge
        */
        // GET: api/Challenges
        [HttpGet("GetAvailableVwChallenges/{username}")]
        public async Task<ActionResult<IEnumerable<VwChallenge>>> GetAvailableVwChallenges (string username)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var result = await _context.VwChallenges.FromSqlRaw(
                "EXEC spGetAvailableVwChallenges @Username",
                new SqlParameter("@Username", username)
                ).ToListAsync();
            return result;
        }

        /**
        * Returns a Challenge according to the given id
        * @param  id is the of the primary key of the Challenge you want to get
        * @return Challenge 
        */
        // GET: api/Challenges/
        [HttpGet("{id}")]
        public async Task<ActionResult<Challenge>> GetChallenge(string id)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            var result = await _context.Challenges.FromSqlRaw(
                "EXEC spGetChallenge @Name",
                new SqlParameter("@Name", id)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Returns the challenges created/managed by the user with the given username
        * @param  username it is the username of the user you want to get the managed challenges
        * @return Challenge[] list of Challenge
        */
        [HttpGet("ByManager/{username}")]
        public async Task<dynamic> GetChallengesByManager(string username)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            try {
                var result = await _context.Challenges.FromSqlRaw(
                    "EXEC spGetChallengesByManager @Username",
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
        * Returns the groups that have access to the Challenge with the given challengeName
        * @param  challengeName it is the id of the challenge you want to get the related groups
        * @return Group[] list of groups
        */
        [HttpGet("Groups/{challengeName}")]
        public async Task<ActionResult<IEnumerable<Group>>> GetChallengeGroups(string challengeName)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var result = await _context.Groups.FromSqlRaw(
                "EXEC spGetChallengeGroups @ChallengeName",
                new SqlParameter("@ChallengeName", challengeName)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result);
        }

        /**
        * Returns the sponsors of the Challenge with the given challengeName
        * @param  challengeName it is the id of the challenge you want to get the related sponsors
        * @return Sponsor[] list of sponsors
        */
        // GET: api/Challenges
        [HttpGet("Sponsors/{challengeName}")]
        public async Task<ActionResult<IEnumerable<Sponsor>>> GetChallengeSponsors(string challengeName)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var result = await _context.Sponsors.FromSqlRaw(
                "EXEC spGetChallengeSponsors @ChallengeName",
                new SqlParameter("@ChallengeName", challengeName)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result);
        }

        /**
        * Returns the Sportmen that have access to the Challenge with the given challengeName
        * @param  challengeName it is the id of the challenge you want to get the related incribed Sportmen
        * @return Sportman[] list of Sportman
        */
        // GET: api/Challenges
        [HttpGet("Participants/{challengeName}")]
        public async Task<ActionResult<IEnumerable<VwSportmanNationality>>> GetChallengeParticipants(string challengeName)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var result = await _context.VwSportmanNationalities.FromSqlRaw(
                "EXEC spGetChallengeParticipants @ChallengeName",
                new SqlParameter("@ChallengeName", challengeName)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result);
        }

        /**
        * Updates the Challenge with the given challengeName
        * @param id is the primary key of the Chellenge you want to update
        * @param  challenge contains the data you want to update
        * @return true if the update was successful
        */
        // PUT: api/Challenges/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChallenge(string id, Challenge challenge)
        {
            if (id != challenge.Name)
            {
                return BadRequest();
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateChallenge @Name, @Goal, @Private, @StartDate, @EndDate, @Deep, @Type",
                    new SqlParameter("@Name", id),
                    new SqlParameter("@Goal", challenge.Goal),
                    new SqlParameter("@Private", challenge.Private),
                    new SqlParameter("@StartDate", challenge.StartDate),
                    new SqlParameter("@EndDate", challenge.EndDate),
                    new SqlParameter("@Deep", challenge.Deep),
                    new SqlParameter("@Type", challenge.Type)
                    );
                return Ok(true);
                //var result = await _context.Challenges.FromSqlRaw($"spUpdateChallenge {name}, {challenge.Goal}, {challenge.Private}, {challenge.StartDate}, {challenge.EndDate}, {challenge.Deep}, {challenge.Type}").ToListAsync();
                //return Ok(result);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChallengeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        /**
        * Insert the given Challenge into the database and Inserts the given username as the manager of the creted Challenge
        * @param  challenge is the Challenge you want to insert into the database
        * @param username is the username of user who created the Challenge
        * @return true if the inserts was successful
        */
        // POST: api/Challenges
        [HttpPost("{username}")]
        public async Task<ActionResult<Challenge>> PostChallenge(Challenge challenge, string username)
        {
          if (_context.Challenges == null)
          {
              return Problem("Entity set 'StraviaTecContext.Challenges'  is null.");
          }
            
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertChallenge @Name, @Goal, @Private, @StartDate, @EndDate, @Deep, @Type, @ManagerUsername",
                    new SqlParameter("@Name", challenge.Name),
                    new SqlParameter("@Goal", challenge.Goal),
                    new SqlParameter("@Private", challenge.Private),
                    new SqlParameter("@StartDate", challenge.StartDate),
                    new SqlParameter("@EndDate", challenge.EndDate),
                    new SqlParameter("@Deep", challenge.Deep),
                    new SqlParameter("@Type", challenge.Type),
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
        * Add a sponsor given sponsor to the given challenge
        * @param sponsorTradeName it is the id of the Sponsor you want to add to the Challenge
        * @param challengeName is the id of the Challenge you want to add the sponsor
        * @return true if the sponsor was added to the Challenge successfully
        */
        // POST: api/Challenges
        [HttpPost("AddSponsor/{sponsorTradeName}/{challengeName}")]
        public async Task<ActionResult<Challenge>> PostChallengeSponsor(string sponsorTradeName, string challengeName)
        {
            if (_context.Challenges == null)
            {
                return Problem("Entity set 'StraviaTecContext.Challenges'  is null.");
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spAddChallengeSponsor @SponsorTradeName, @ChallengeName",
                    new SqlParameter("@SponsorTradeName", sponsorTradeName),
                    new SqlParameter("@ChallengeName", challengeName)
                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the Challenge with the given id
        * @param  id is the primary key of the Challenge you want to Delete
        * @return true if the deletion was successful
        */
        // DELETE: api/Challenges/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChallenge(string id)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null)
            {
                return NotFound();
            }

            await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spDeleteChallenge @Name",
                    new SqlParameter("@Name", id)
                    );

            return Ok(true);
        }

        /**
        * Removes the access of all the grops to the given Challenge
        * @param  challengeName it is the id of the challenge you want to delete the groups
        * @return true if the deletion was successful
        */
        [HttpDelete("DeleteGroups/{challengeName}")]
        public async Task<IActionResult> DeleteChallengeGroups(string challengeName)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteChallengeGroups @ChallengeName",
                   new SqlParameter("@ChallengeName", challengeName)
                   );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        /**
        * Deletes all the sponsors of the given Challenge
        * @param  challengeName it is the id of the challenge you want to delete the sponsors
        * @return true if the deletion was successful
        */
        [HttpDelete("DeleteSponsors/{challengeName}")]
        public async Task<IActionResult> DeleteChallengeSponsors(string challengeName)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteChallengeSponsors @ChallengeName",
                   new SqlParameter("@ChallengeName", challengeName)
                   );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        private bool ChallengeExists(string id)
        {
            return (_context.Challenges?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
