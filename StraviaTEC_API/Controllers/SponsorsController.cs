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
    public class SponsorsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public SponsorsController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Sponsors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sponsor>>> GetSponsors()
        {
          if (_context.Sponsors == null)
          {
              return NotFound();
          }
            return await _context.Sponsors.ToListAsync();
        }

        // GET: api/Sponsors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sponsor>> GetSponsor(string id)
        {
          if (_context.Sponsors == null)
          {
              return NotFound();
          }
            var sponsor = await _context.Sponsors.FindAsync(id);

            if (sponsor == null)
            {
                return NotFound();
            }

            return sponsor;
        }

        // PUT: api/Sponsors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSponsor(string id, Sponsor sponsor)
        {
            if (id != sponsor.TradeName)
            {
                return BadRequest();
            }

            _context.Entry(sponsor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SponsorExists(id))
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

        // POST: api/Sponsors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sponsor>> PostSponsor(Sponsor sponsor)
        {
          if (_context.Sponsors == null)
          {
              return Problem("Entity set 'StraviaTecContext.Sponsors'  is null.");
          }
            _context.Sponsors.Add(sponsor);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SponsorExists(sponsor.TradeName))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSponsor", new { id = sponsor.TradeName }, sponsor);
        }

        // DELETE: api/Sponsors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSponsor(string id)
        {
            if (_context.Sponsors == null)
            {
                return NotFound();
            }
            var sponsor = await _context.Sponsors.FindAsync(id);
            if (sponsor == null)
            {
                return NotFound();
            }

            _context.Sponsors.Remove(sponsor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SponsorExists(string id)
        {
            return (_context.Sponsors?.Any(e => e.TradeName == id)).GetValueOrDefault();
        }
    }
}
