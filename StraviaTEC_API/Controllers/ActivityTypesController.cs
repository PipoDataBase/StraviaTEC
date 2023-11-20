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
    public class ActivityTypesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public ActivityTypesController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Returns a list of ActivityTypes containing all the ActivityTypes in the 
        * database
        * @return ActivityType[] It returns a list containting ActivityTypes objects
        */
        // GET: api/ActivityTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActivityType>>> GetActivityTypes()
        {
          if (_context.ActivityTypes == null)
          {
              return NotFound();
          }
            return await _context.ActivityTypes.FromSqlRaw("spGetActivityTypes").ToListAsync();
        }

        // GET: api/ActivityTypes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityType>> GetActivityType(byte id)
        {
            if (_context.ActivityTypes == null)
            {
                return NotFound();
            }

            var result = await _context.ActivityTypes.FromSqlRaw(
                "EXEC spGetActivityType @Id",
                new SqlParameter("@Id", id)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Updates and ActivityType with the provided data
        * @param  id its an integer containing the primary key of the ActivityType you
        *         want to update
        * @param activityType its an ActivityType containing the data you want to update
        * @return true if the update was successful or raises an error if it failed
        */
        // PUT: api/ActivityTypes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutActivityType(byte id, ActivityType activityType)
        {
            if (id != activityType.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spUpdateActivityType @Id, @Type",
                   new SqlParameter("@Id", id),
                   new SqlParameter("@Type", activityType.Type)
                   );
                return Ok("ActivityType Updated");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityTypeExists(id))
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
        * Inserts the provided ActivityType into the database
        * @param  activityType it is the object you want to insert into the database
        * @return true if the insert was successful or it raises an error if it failed
        */
        // POST: api/ActivityTypes
        [HttpPost]
        public async Task<ActionResult<ActivityType>> PostActivityType(string activityType)
        {
          if (_context.ActivityTypes == null)
          {
              return Problem("Entity set 'StraviaTecContext.ActivityTypes'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spInsertActivityType @Type",
                   new SqlParameter("@Type", activityType)
                   );
                return Ok("ActivityType Created");
                
                
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the indicated ActivityType from the database
        * @param  id  its a byte containing the primary key of the ActivityType
        *         you want to delete
        * @return Activity It true if the deletion was successful or raises an error
        *         if it failed
        */
        // DELETE: api/ActivityTypes/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivityType(byte id)
        {
            if (_context.ActivityTypes == null)
            {
                return NotFound();
            }
            var activityType = await _context.ActivityTypes.FindAsync(id);
            if (activityType == null)
            {
                return NotFound();
            }

            await _context.Database.ExecuteSqlRawAsync(
                   "EXEC spDeleteActivityType @Id",
                   new SqlParameter("@Id", id)
                   );
            return Ok("ActivityType deleted");
        }

        private bool ActivityTypeExists(byte id)
        {
            return (_context.ActivityTypes?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
