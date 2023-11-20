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
    public class SponsorsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public SponsorsController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Returns all the sponsors in the database
        * @return Sponsor[] list of Sponsor
        */
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

        /**
        * Return the Sponsor with the given id
        * @param  id  is the primary key of the sponsor you want
        * @return  Sponsor
        */
        // GET: api/Sponsors/
        [HttpGet("{id}")]
        public async Task<ActionResult<Sponsor>> GetSponsor(string id)
        {
            if (_context.Sponsors == null)
            {
                return NotFound();
            }

            var result = await _context.Sponsors.FromSqlRaw(
                    "EXEC spGetSponsor @TradeName",
                    new SqlParameter("@TradeName", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Update the data of a given sponsor
        * @param  id  is the primary key of the sponsor you want to update 
        * @param sponsor Sponsor with the data you want to update
        * @return true if the update was successful
        */
        // PUT: api/Sponsors/
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
                    new SqlParameter("@TradeName", id),
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

        /**
        * Insert the given Sponsor into the database
        * @param sponsor Sponsor you want to insert into the database
        * @return true is the insertion was successful 
        */
        // POST: api/Sponsors
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
                    new SqlParameter("@TradeName", sponsor.TradeName),
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

        /**
        * Deletes the given Sponsor from the database
        * @param id primary key of the sponsor you want to delete from the database
        * @return true is the deletion was successful 
        */
        // DELETE: api/Sponsors/
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
