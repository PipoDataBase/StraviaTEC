using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            return await _context.Sportmen.ToListAsync();
        }

        // GET: api/Sportmen/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sportman>> GetSportman(string id)
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

            return sportman;
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

            _context.Entry(sportman).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SportmanExists(id))
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

        // POST: api/Sportmen
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sportman>> PostSportman(Sportman sportman)
        {
          if (_context.Sportmen == null)
          {
              return Problem("Entity set 'StraviaTecContext.Sportmen'  is null.");
          }
            _context.Sportmen.Add(sportman);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SportmanExists(sportman.Username))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSportman", new { id = sportman.Username }, sportman);
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

            _context.Sportmen.Remove(sportman);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SportmanExists(string id)
        {
            return (_context.Sportmen?.Any(e => e.Username == id)).GetValueOrDefault();
        }
    }
}
