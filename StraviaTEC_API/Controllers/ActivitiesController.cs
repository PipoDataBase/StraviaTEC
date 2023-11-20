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

        /**
        * Returns a list of Activity object model with all the activities in the 
        * database
        * @return Activity[] It returns a list of activities
        */
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

        /**
        * Returns an Activity object model within the information of the Activity
        * requested according to the provided id
        * @param  id  its an integer containing the primary key of an Activity
        * @return Activity It returns an Activity
        */
        // GET: api/Activities/{id}
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

        /**
        * Returns It updates and Activity object with the data of the provided
        * activity and returns true if the update was successful or and error
        * if it failed
        * @param  id it is the primary key of the existing Activity you want
        *         to modify
        * @param  activity its an activity model with the data that you want
        *         to update
        * @return true if the update was successful or raises and error if it
        *         failed
        */
        // PUT: api/Activities/{id}
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
        /*
            Creates an activity related to a Challenge, Race or none of them 
                    depending if the ChallengeName and RaceName are empty or not.
            @param activity it is the Activity you want to insert in the database
            @return true if the insert was successful or raises an error if it failed
            @Use example in swagger (Activity not related to any Race or Challenge neither):
                                    {
                                      "id": 0,
                                      "kilometers": 10,
                                      "duration": "01:32:20",
                                      "date": "2023-11-03T08:52:15.694Z",
                                      "routePath": "string",
                                      "description": "Esta actividad fue de calentamiento",
                                      "username": "Camanem",
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
                        "EXEC spInsertActivityRace @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @Type",
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
                        "EXEC spInsertActivityChallenge @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @ChallengeName, @Type",
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
                    "EXEC spInsertActivityChallengeAndRace @Kilometers, @Duration, @Date, @RoutePath, @Description, @Username, @RaceName, @ChallengeName, @Type",
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

        /**
        * Deletes the indicated Activity from the database
        * @param  id it is the primary key of the Activity you want to delete
        * @return true if the deletion was successful or raises an error if it failed
        */
        // DELETE: api/Activities/{id}
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
