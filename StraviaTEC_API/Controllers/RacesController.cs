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

        /**
        * Retuns all the races in the database
        * @return Race[] list of Race
        */
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

        /**
        * Returns all the visible and joinable races for the user with the given username
        * @param  username name user you want to get the visible races
        * @return VwRace[] list of VwRace
        */
        // GET: api/Races
        [HttpGet("GetAvailableVwRaces/{username}")]
        public async Task<ActionResult<IEnumerable<VwRace>>> GetAvailableVwRaces(string username)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.VwRaces.FromSqlRaw(
                    "EXEC spGetAvailableVwRaces @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();
        }


        /**
        * Returns all the visible races for the user with the given username. Even if the 
        * have already happened
        * @param  username name user you want to get the visible races
        * @return VRace[] list of VwRace
        */
        // GET: api/Races
        [HttpGet("GetAllRaces/{username}")]
        public async Task<ActionResult<IEnumerable<VwRace>>> GetAllRaces(string username)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.VwRaces.FromSqlRaw(
                    "EXEC spGetAllRaces @Username",
                    new SqlParameter("@Username", username)
                    ).ToListAsync();
        }

        /**
        * Returns all races that the given user manages
        * @param  username name user you want to get the managing races
        * @return Race[] list of Race
        */
        // GET: api/Races
        [HttpGet("ByManager/{username}")]
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

        /**
        * Get all the categories of a given race
        * @param  raceName name race you want to get the categories
        * @return Category[] list of Category
        */
        // GET: api/Races
        [HttpGet("Categories/{raceName}")]
        public async Task<ActionResult<IEnumerable<Category>>> GetRaceCategories(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Categories.FromSqlRaw(
                    "EXEC spGetRaceCategories @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }


        /**
        * Returns all the groups that have access to the race with the given raceName
        * @param  raceName name of the race you want to get all the groups related to
        * @return Group[] list of Group
        */
        [HttpGet("Groups/{raceName}")]
        public async Task<ActionResult<IEnumerable<Group>>> GetRaceGroups(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Groups.FromSqlRaw(
                    "EXEC spGetRaceGroups @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }

        /**
        * Returns all the sponsors of the given raceName
        * @param  raceName name of the race you want to get all the sponsors
        * @return Sponsor[] list of Sponsor
        */
        // GET: api/Races
        [HttpGet("Sponsors/{raceName}")]
        public async Task<ActionResult<IEnumerable<Sponsor>>> GetRaceSponsors(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Sponsors.FromSqlRaw(
                    "EXEC spGetRaceSponsors @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }


        /**
        * Returns all the BankAccounts of the race with the given raceName
        * @param  raceName name of the race you want to get all the BankAccounts associated
        * @return BankAccount[] list of BankAccount
        */
        // GET: api/Races
        [HttpGet("BankAccounts/{raceName}")]
        public async Task<ActionResult<IEnumerable<BankAccount>>> GetRaceBankAccounts(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.BankAccounts.FromSqlRaw(
                    "EXEC spGetRaceBankAccounts @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }

        /**
        * Returns all the Bills associated with the Race with the given raceName
        * @param  raceName name of the race you want to get all the Bills related
        * @return Bill[] list of Bill
        */
        // GET: api/Races
        [HttpGet("Bills/{raceName}")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetRaceBills(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.Bills.FromSqlRaw(
                    "EXEC spGetRaceBills @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }


        /**
        * Returns the race with the given raceName
        * @param  id primary key of the race you want to get 
        * @return Race
        */
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

        /**
        * Returns the leaderboard of the race with the given raceName
        * @param  raceName name of the race you want to get its leaderboard
        * @return WvRaceReportSportmanLeaderboard[] list of WvRaceReportSportmanLeaderboard
        */
        // GET: api/Races
        [HttpGet("GetLeaderboardReport/{raceName}")]
        public async Task<ActionResult<IEnumerable<WvRaceReportSportmanLeaderboard>>> GetLeaderboardReport(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.WvRaceReportSportmanLeaderboards.FromSqlRaw(
                    "EXEC spGetRaceReportSportmanLeaderboard @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }

        /**
        * Returns the participants of the race with the given raceName
        * @param  raceName name of the race you want to get its participants
        * @return VwRaceReportSportmanParticipant[] list of VwRaceReportSportmanParticipant
        */
        // GET: api/Races
        [HttpGet("GetParticipantReport/{raceName}")]
        public async Task<ActionResult<IEnumerable<VwRaceReportSportmanParticipant>>> GetParticipantReport(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }
            return await _context.VwRaceReportSportmanParticipants.FromSqlRaw(
                    "EXEC spGetRaceReportSportmanParticipant @RaceName",
                    new SqlParameter("@RaceName", raceName)
                    ).ToListAsync();
        }


        /**
        * Update the data of the the race with the given raceName with the given data
        * @param  id name of the race you want to update
        * @param race Race with the data you want to update
        * @return true if the update was successful
        */
        // PUT: api/Races/
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
                    "EXEC spUpdateRace @Name, @InscriptionPrice, @Date, @Private, @RoutePath, @Type",
                    new SqlParameter("@Name", id),
                    new SqlParameter("@InscriptionPrice", race.InscriptionPrice),
                    new SqlParameter("@Date", race.Date),
                    new SqlParameter("@Private", race.Private),
                    new SqlParameter("@RoutePath", race.RoutePath),
                    new SqlParameter("@Type", race.Type)
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


        /**
        * Insert the given Race to the database and inserts the given user as its manager
        * @param  race Race you wanto insert
        * @param username of the user that is creating the race
        * @return true in the creation was successful
        */
        // POST: api/Races
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


        /**
        * Add the givent Category to the given Race
        * @param  raceName name of the race you want to add the category
        * @param categoryId is the primary key of the category you wanto to add to the race
        * @return true if the query was successful
        */
        // POST: api/Races
        [HttpPost("AddCategory/{raceName}/{categoryId}")]
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


        /**
        * Add a given sponsor to a given race
        * @param  raceName name of the race you want to add the sponsor
        * @param sponsorTradeName is the name of the sponsor to add
        * @return true if the query was successful
        */
        // POST: api/Races
        [HttpPost("AddSponsor/{sponsorTradeName}/{raceName}")]
        public async Task<ActionResult<Race>> PostRaceSponsor(string sponsorTradeName, string raceName)
        {
            if (_context.Races == null)
            {
                return Problem("Entity set 'StraviaTecContext.Races'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                                    "EXEC spAddRaceSponsor @SponsorTradeName, @RaceName",
                                    new SqlParameter("@SponsorTradeName", sponsorTradeName),
                                    new SqlParameter("@RaceName", raceName)
                                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the race with the given id
        * @param  id name of the race you want to delete
        * @return true if the deletion was successful
        */
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

            return Ok(true);
        }

        /**
        * Deletes all the categories of a given race
        * @param  raceName is the name of the race you want to delete all its categories
        * @return true if the deletion was successful
        */
        [HttpDelete("DeleteCategories/{raceName}")]
        public async Task<IActionResult> DeleteRaceCategories(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteRaceCategories @RaceName",
                   new SqlParameter("@RaceName", raceName)
                   );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        /**
        * Deletes all the groups of a given race
        * @param  raceName is the name of the race you want to delete all its groups 
        * @return true if the deletion was successful
        */
        [HttpDelete("DeleteGroups/{raceName}")]
        public async Task<IActionResult> DeleteRaceGroups(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteRaceGroups @RaceName",
                   new SqlParameter("@RaceName", raceName)
                   );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        /**
        * Deletes all the sponsors of a given race
        * @param  raceName is the name of the race you want to delete all its sponsors 
        * @return true if the deletion was successful
        */
        [HttpDelete("DeleteSponsors/{raceName}")]
        public async Task<IActionResult> DeleteRaceSponsors(string raceName)
        {
            if (_context.Races == null)
            {
                return NotFound();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteRaceSponsors @RaceName",
                   new SqlParameter("@RaceName", raceName)
                   );

                return Ok(true);
            }
            catch
            {
                throw;
            }
        }

        private bool RaceExists(string id)
        {
            return (_context.Races?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
