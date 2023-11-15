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

        // GET: api/Challenges/5
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

        [HttpGet("ByManager/{username}")]
        public async Task<dynamic> GetChallengesByManager(string username)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }

            try {
                var result = await _context.Challenges.FromSqlRaw(
                    "EXEC spGetChallengeByManager @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

                return Ok(result);
            }
            catch
            {
                throw;
            }
        }

        // GET: api/Challenges
        [HttpGet("GetSponsors/{challengeName}")]
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

        // PUT: api/Challenges/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        // POST: api/Challenges
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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


        // POST: api/Challenges
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        // DELETE: api/Challenges/5
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
