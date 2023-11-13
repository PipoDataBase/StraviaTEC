using System;
using System.Collections.Generic;
using System.Drawing.Printing;
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
    public class NationalitiesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public NationalitiesController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Nationalities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Nationality>>> GetNationalities()
        {
          if (_context.Nationalities == null)
          {
              return NotFound();
          }
            return await _context.Nationalities.FromSqlRaw("spGetNationalities").ToListAsync();
        }

        // GET: api/Nationalities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nationality>> GetNationality(byte id)
        {
            if (_context.Nationalities == null)
            {
                return NotFound();
            }

            var result = await _context.Nationalities.FromSqlRaw(
                    "EXEC spGetNationality @Id",
                    new SqlParameter("@Id", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        // PUT: api/Nationalities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNationality(byte id, Nationality nationality)
        {
            if (id != nationality.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                 "EXEC spUpdateNationality @Id, @Nationality",
                 new SqlParameter("@Id", id),
                 new SqlParameter("@Nationality", nationality.Nationality1)
                 );
                return Ok("Nationality Updated");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NationalityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Nationalities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Nationality>> PostNationality(string nationality)
        {
          if (_context.Nationalities == null)
          {
              return Problem("Entity set 'StraviaTecContext.Nationalities'  is null.");
          }
            await _context.Database.ExecuteSqlRawAsync(
                  "EXEC spInsertNationality @Nationality",
                  new SqlParameter("@Nationality", nationality)
                  );
            return Ok("Nationality Created");
        }

        // DELETE: api/Nationalities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNationality(byte id)
        {
            if (_context.Nationalities == null)
            {
                return NotFound();
            }
            var nationality = await _context.Nationalities.FindAsync(id);
            if (nationality == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                              "EXEC spDeleteNationality @Id",
                              new SqlParameter("@Id", id)
                              );
            return Ok("Nationality deleted");
        }

        private bool NationalityExists(byte id)
        {
            return (_context.Nationalities?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
