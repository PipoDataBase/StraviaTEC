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

        // GET: api/ActivityTypes/5
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

        // PUT: api/ActivityTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        // POST: api/ActivityTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        // DELETE: api/ActivityTypes/5
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
