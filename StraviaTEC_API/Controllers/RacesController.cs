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
    public class RacesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public RacesController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Races
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Race>>> GetRaces()
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Races.FromSqlRaw("EXEC spGetRaces").ToListAsync();
        }

        // GET: api/Races
        [HttpGet("byManager/{username}")]
        public async Task<ActionResult<IEnumerable<Race>>> GetRacesByManager(string username)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Races.FromSqlRaw(
                    "EXEC spGetRacesByManager @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();
        }

        // GET: api/Races
        [HttpGet("Categories/{raceName}")]
        public async Task<ActionResult<IEnumerable<Category>>> GetGetRaceCategoriesByName(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Categories.FromSqlRaw(
                    "EXEC spGetRaceCategoriesByName @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }

        // GET: api/Races/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Race>> GetRace(string id)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            var race = await _context.Races.FindAsync(id);

            if (race == null)
            {
                return NotFound();
            }


            var result = await _context.Races.FromSqlRaw(
                    "EXEC spGetRace @Name",
                    new SqlParameter("@Name", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }


        // PUT: api/Races/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRace(string id, Race race)
        {
            if (id != race.Name)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateRace @Name, @InscriptionPrice, @Date, @Private, @RoutePath",
                    new SqlParameter("@Name", id),
                    new SqlParameter("@InscriptionPrice", race.InscriptionPrice),
                    new SqlParameter("@Date", race.Date),
                    new SqlParameter("@Private", race.Private),
                    new SqlParameter("@RoutePath", race.RoutePath)
                    );
                return Ok(true);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RaceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Races
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{username}")]
        public async Task<ActionResult<Race>> PostRace(Race race, string username)
        {
          if (_context.Races == null)
          {
              return Problem("Entity set 'StraviaTecContext.Races'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                                    "EXEC spInsertRace @Name, @InscriptionPrice, @Date, @Private, @RoutePath, @Type, @ManagerUsername",
                                    new SqlParameter("@Name", race.Name),
                                    new SqlParameter("@InscriptionPrice", race.InscriptionPrice),
                                    new SqlParameter("@Date", race.Date),
                                    new SqlParameter("@Private", race.Private),
                                    new SqlParameter("@RoutePath", race.RoutePath),
                                    new SqlParameter("@Type", race.Type),
                                    new SqlParameter("@ManagerUsername", username)
                                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        // POST: api/Races
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("addRaceCategory/{raceName},{categoryId}")]
        public async Task<ActionResult<Race>> PostRaceCategory(string raceName, int categoryId)
        {
            if (_context.Races == null)
            {
                return Problem("Entity set 'StraviaTecContext.Races'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                                    "EXEC spAddRaceCategory @RaceName, @CategoryId",
                                    new SqlParameter("@RaceName", raceName),
                                    new SqlParameter("@CategoryId", categoryId)
                                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        // DELETE: api/Races/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRace(string id)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            var race = await _context.Races.FindAsync(id);
            if (race == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spDeleteRace @Name",
                    new SqlParameter("@Name", id)
                    );

            return Ok("Race Deleted");
        }

        private bool RaceExists(string id)
        {
            return (_context.Races?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
