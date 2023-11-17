using System;
using System.Collections.Generic;
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
    public class SportmenController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public SportmenController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Sportmen
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sportman>>> GetSportmen()
        {
          if (_context.Sportmen == null)
          {
              return NotFound();
          }
            return await _context.Sportmen.FromSqlRaw("spGetSportmen").ToListAsync();
        }

        // GET: api/Sportmen/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sportman>> GetSportman(string id)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }

            var result = await _context.Sportmen.FromSqlRaw(
                    "EXEC spGetSportman @Username",
                    new SqlParameter("@Username", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        // GET: api/Sportmen
        [HttpGet("SportmenNationView")]
        public async Task<ActionResult<IEnumerable<VwSportmanNationality>>> GetSportmenNationView()
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            return await _context.VwSportmanNationalities.FromSqlRaw("spGetSportmenNationView").ToListAsync();
        }

        // GET: api/Sportmen
        [HttpGet("Search/{username}")]
        public async Task<ActionResult<IEnumerable<VwSportmanNationality>>> GetSportmenNationViewByName(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.VwSportmanNationalities.FromSqlRaw(
                    "EXEC spGetSportmanNationView @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }
            return result;
        }

        // GET: api/Sportmen
        [HttpGet("SportmanNationView/{username}")]
        public async Task<ActionResult<VwSportmanNationality>> GetSportmanNationView(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.VwSportmanNationalities.FromSqlRaw(
                    "EXEC spGetSportmanNationView @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

            return result.ElementAt(0);
        }

        // GET: api/Sportmen
        [HttpGet("participatingChallenges/{username}")]
        public async Task<ActionResult<IEnumerable<Challenge>>> GetSportmanChallenges(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.Challenges.FromSqlRaw(
                    "EXEC spGetSportmanChallenges @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

            return result;
        }

        // GET: api/Sportmen
        [HttpGet("GetFriends/{username}")]
        public async Task<ActionResult<IEnumerable<VwSportmanNationality>>> GetFriends(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.VwSportmanNationalities.FromSqlRaw(
                    "EXEC spGetFriends @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

            return result;
        }


        // GET: api/Sportmen
        [HttpGet("GetParticipatingGroups/{username}")]
        public async Task<ActionResult<IEnumerable<Group>>> GetParticipatingGroups(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.Groups.FromSqlRaw(
                    "EXEC spGetParticipatingGroups @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();
            return result;
        }

        // GET: api/Sportmen
        [HttpGet("GetJoinedRaces/{username}")]
        public async Task<ActionResult<IEnumerable<VwRace>>> GetJoinedRaces(string username)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var result = await _context.VwRaces.FromSqlRaw(
                    "EXEC spGetJoinedRaces @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();

            return result;
        }

        // GET: api/Sportmen
        [HttpGet("Login/{username}/{password}")]
        public async Task<IActionResult> Login (string username, string password)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }

            try { 
                var result = await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spLogin @Username, @Password",
                        new SqlParameter("@Username", username),
                        new SqlParameter("@Password", password)
                        );
                return Ok(true);
            }
            catch (Exception ex) {

                throw ex;
            }
        
        }

        // PUT: api/Sportmen/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSportman(string id, Sportman sportman)
        {
            if (id != sportman.Username)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateSportman @Username, @Name, @LastName1, @LastName2, @BirthDate, @PhotoPath, @Password, @Nationality",
                    new SqlParameter("@Username", id),
                    new SqlParameter("@Name", sportman.Name),
                    new SqlParameter("@LastName1", sportman.LastName1),
                    new SqlParameter("@LastName2", sportman.LastName2),
                    new SqlParameter("@BirthDate", sportman.BirthDate),
                    new SqlParameter("@PhotoPath", sportman.PhotoPath),
                    new SqlParameter("@Password", sportman.Password),
                    new SqlParameter("@Nationality", sportman.Nationality)
                    );
                return Ok("Sportman Updated");
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        // POST: api/Sportmen
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sportman>> PostSportman(Sportman sportman)
        {
          if (_context.Sportmen == null)
          {
              return Problem("Entity set 'StraviaTecContext.Sportmen'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                "EXEC spInsertSportman @Username, @Name, @LastName1, @LastName2, @BirthDate, @PhotoPath, @Password, @Nationality",
                    new SqlParameter("@Username", sportman.Username),
                    new SqlParameter("@Name", sportman.Name),
                    new SqlParameter("@LastName1", sportman.LastName1),
                    new SqlParameter("@LastName2", sportman.LastName2),
                    new SqlParameter("@BirthDate", sportman.BirthDate),
                    new SqlParameter("@PhotoPath", sportman.PhotoPath),
                    new SqlParameter("@Password", sportman.Password),
                    new SqlParameter("@Nationality", sportman.Nationality)
                );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        // POST: api/Sportmen
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("AddToChallenge/{challengeName}/{username}")]
        public async Task<IActionResult> PostChallengeSportmanParticipant(string challengeName, string username)
        {
            if (_context.Sportmen == null)
            {
                return Problem("Entity set 'StraviaTecContext.Sportmen'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                "EXEC spAddChallengeSportmanParticipant @ChallengeName, @SportmanUsername",
                    new SqlParameter("@ChallengeName", challengeName),
                    new SqlParameter("@SportmanUsername", username)
                );
                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        // POST: api/Sportmen
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("AddFriend/{username}/{friendUsername}")]
        public async Task<IActionResult> PostAddFriend(string username, string friendUsername)
        {
            if (_context.Sportmen == null)
            {
                return Problem("Entity set 'StraviaTecContext.Sportmen'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                "EXEC spAddFriend @username, @friendUsername",
                    new SqlParameter("@username", username),
                    new SqlParameter("@friendUsername", friendUsername)
                );
                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        // POST: api/Sportmen
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("JoinGroup/{username}/{groupName}")]
        public async Task<IActionResult> PosAddToGroup(string username, string groupName)
        {
            if (_context.Sportmen == null)
            {
                return Problem("Entity set 'StraviaTecContext.Sportmen'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                "EXEC spAddToGroup @Username, @GroupName",
                    new SqlParameter("@Username", username),
                    new SqlParameter("@GroupName", groupName)
                );
                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        // DELETE: api/Sportmen/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSportman(string id)
        {
            if (_context.Sportmen == null)
            {
                return NotFound();
            }
            var sportman = await _context.Sportmen.FindAsync(id);
            if (sportman == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
            "EXEC spDeleteSportman @Username",
                new SqlParameter("@Username", id)
            );
            return Ok(true);
        }

        private bool SportmanExists(string id)
        {
            return (_context.Sportmen?.Any(e => e.Username == id)).GetValueOrDefault();
        }
    }
}
