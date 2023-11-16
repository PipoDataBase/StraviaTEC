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
    public class GroupsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public GroupsController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
        {
          if (_context.Groups == null)
          {
              return NotFound();
          }
          return await _context.Groups.FromSqlRaw("EXEC spGetGroups").ToListAsync();
        }

        // GET: api/Groups/5
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


        // GET: api/Groups/5
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

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return result;
        }



        // POST: api/Groups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Group>> PostGroup(Group group)
        {
            if (_context.Groups == null)
            {
                return Problem("Entity set 'StraviaTecContext.Groups'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertGroup @Name, @ManagerUsername",
                    new SqlParameter("@Name", group.Name),
                    new SqlParameter("@ManagerUsername", group.UsernamesNavigation.ElementAt(0).Username)
                    );
                return Ok("Group Created");
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        // DELETE: api/Groups/5
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

            return Ok("Group Deleted");
        }

        private bool GroupExists(string id)
        {
            return (_context.Groups?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
