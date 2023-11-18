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
    public class ActivitiesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public ActivitiesController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Activities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
          if (_context.Activities == null)
          {
              return NotFound();
          }
            return await _context.Activities.FromSqlRaw("spGetActivities").ToListAsync();
        }

        // GET: api/Activities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(int id)
        {
            if (_context.Activities == null)
            {
                return NotFound();
            }

            var result = await _context.Activities.FromSqlRaw(
                    "EXEC spGetActivity @Id",
                    new SqlParameter("@Id", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        // PUT: api/Activities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // @brief 
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivity(int id, Activity activity)
        {
            if (id != activity.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateActivity @Id @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @ChallengeName, @Type",
                    new SqlParameter("@Id", id),
                    new SqlParameter("@Kilometers", activity.Kilometers),
                    new SqlParameter("@Duration", activity.Duration),
                    new SqlParameter("@Date", activity.Date),
                    new SqlParameter("@RoutePath", activity.RoutePath),
                    new SqlParameter("@Description", activity.Description),
                    new SqlParameter("@Username", activity.Username),
                    new SqlParameter("@RaceName", activity.RaceName),
                    new SqlParameter("@ChallengeName", activity.ChallengeName),
                    new SqlParameter("@Type", activity.Type)
                    );
                return Ok(true);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // POST: api/Activities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
            @brief This method creates and activity related to a Challenge, Race or none of them 
                    depending if the ChallengeName and RaceName are empty or not.
            @Use example in swagger (Activity not related to any Race or Challenge neither):
                                    {
                                      "id": 0,
                                      "kilometers": 10,
                                      "duration": "01:32:20",
                                      "date": "2023-11-03T08:52:15.694Z",
                                      "routePath": "string",
                                      "description": "Esta actividad fue de calentamiento",
                                      "username": "ElAlzaVacas17",
                                      "raceName": "",
                                      "challengeName": "",
                                      "type": 0
                                    }
         */
        [HttpPost]
        public async Task<ActionResult<Activity>> PostActivity(Activity activity)
        {
          if (_context.Activities == null)
          {
              return Problem("Entity set 'StraviaTecContext.Activities'  is null.");
          }
            try
            {
                if (activity.ChallengeName == "" && activity.RaceName == "")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spInsertActivity @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @Type",
                        new SqlParameter("@Kilometers", activity.Kilometers),
                        new SqlParameter("@Duration", activity.Duration),
                        new SqlParameter("@Date", activity.Date),
                        new SqlParameter("@RoutePath", activity.RoutePath),
                        new SqlParameter("@Description", activity.Description),
                        new SqlParameter("@Username", activity.Username),
                        new SqlParameter("@Type", activity.Type)
                        );
                    return Ok(true); //"Activity Created"
                }
                else if (activity.ChallengeName == "" && activity.RaceName != "")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spInsertActivityRace @Id @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @Type",
                        new SqlParameter("@Kilometers", activity.Kilometers),
                        new SqlParameter("@Duration", activity.Duration),
                        new SqlParameter("@Date", activity.Date),
                        new SqlParameter("@RoutePath", activity.RoutePath),
                        new SqlParameter("@Description", activity.Description),
                        new SqlParameter("@Username", activity.Username),
                        new SqlParameter("@RaceName", activity.RaceName),
                        new SqlParameter("@Type", activity.Type)
                        );
                    return Ok(true); //"Activity from Race Created"
                }
                else if (activity.ChallengeName != "" && activity.RaceName == "")
                {
                    await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spInsertActivityChallenge @Id @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @ChallengeName, @Type",
                        new SqlParameter("@Kilometers", activity.Kilometers),
                        new SqlParameter("@Duration", activity.Duration),
                        new SqlParameter("@Date", activity.Date),
                        new SqlParameter("@RoutePath", activity.RoutePath),
                        new SqlParameter("@Description", activity.Description),
                        new SqlParameter("@Username", activity.Username),
                        new SqlParameter("@ChallengeName", activity.ChallengeName),
                        new SqlParameter("@Type", activity.Type)
                        );
                    return Ok(true); //"Activity from Challenge Created"
                }
                else
                {
                    await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertActivityChallengeAndRace @Id @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @ChallengeName, @Type",
                    new SqlParameter("@Kilometers", activity.Kilometers),
                    new SqlParameter("@Duration", activity.Duration),
                    new SqlParameter("@Date", activity.Date),
                    new SqlParameter("@RoutePath", activity.RoutePath),
                    new SqlParameter("@Description", activity.Description),
                    new SqlParameter("@Username", activity.Username),
                    new SqlParameter("@RaceName", activity.RaceName),
                    new SqlParameter("@ChallengeName", activity.ChallengeName),
                    new SqlParameter("@Type", activity.Type)
                    );
                    return Ok(true); //"Activity from Challenge and Race Created"
                }

            }
            catch (DbUpdateException)
            {
                if (ActivityExists(activity.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Activities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(int id)
        {
            if (_context.Activities == null)
            {
                return NotFound();
            }
            var activity = await _context.Activities.FindAsync(id);
            if (activity == null)
            {
                return NotFound();
            }

            await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spDeleteActivity @Id",
                    new SqlParameter("@Id", id)
                    );

            return Ok(true);

        }

        private bool ActivityExists(int id)
        {
            return (_context.Activities?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
