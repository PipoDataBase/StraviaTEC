using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
            return await _context.Sponsors.FromSqlRaw("spGetSponsors").ToListAsync();

        }

        // GET: api/Sponsors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sponsor>> GetSponsor(string id)
        {
          if (_context.Sponsors == null)
          {
              return NotFound();
          }
          var result = await _context.Sponsors.FromSqlRaw($"spGetSponsor {id}").ToListAsync();
          return Ok(result);
        }

        // PUT: api/Sponsors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // In swagger add "" in the Id, otherwise throws error for not recognizing as string
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSponsor(string id, Sponsor sponsor)
        {
            if (id != sponsor.TradeName)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateSponsor @TradeName, @LegalRepresentant, @Phone, @LogoPath",
                    new SqlParameter("TradeName", id),
                    new SqlParameter("@LegalRepresentant", sponsor.LegalRepresentant),
                    new SqlParameter("@Phone", sponsor.Phone),
                    new SqlParameter("@LogoPath", sponsor.LogoPath)
                    );
                return Ok("Sponsor Updated");
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
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertSponsor @TradeName, @LegalRepresentant, @Phone, @LogoPath",
                    new SqlParameter("TradeName", sponsor.TradeName),
                    new SqlParameter("@LegalRepresentant", sponsor.LegalRepresentant),
                    new SqlParameter("@Phone", sponsor.Phone),
                    new SqlParameter("@LogoPath", sponsor.LogoPath)
                    );
                return Ok("Sponsor Created");
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
            await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spDeleteSponsor @TradeName",
                    new SqlParameter("@TradeName", id)
                    );

            return Ok("Sponsor Deleted");
        }

        private bool SponsorExists(string id)
        {
            return (_context.Sponsors?.Any(e => e.TradeName == id)).GetValueOrDefault();
        }
    }
}
