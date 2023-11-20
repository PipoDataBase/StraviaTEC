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

        /**
        * Returns all the nationalities from the databases
        * @return Nationality[] list of Nationality
        */
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

        /**
        * Return the Nationality with the given id
        * @param  id  primary key of the nationality you want to get
        * @return Nationality
        */
        // GET: api/Nationalities/
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

        /**
        * Updates the data of the given Nationality
        * @param  id primary key of the nationality you want to update
        * @param nationality natinality with the data you want to update
        * @return true if the update was successful
        */
        // PUT: api/Nationalities/
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

        }

        /**
        * Insert the given Nationality into the database
        * @param  nationality it is the nationality you want to insert into the database
        * @return true if the insert was successful
        */
        // POST: api/Nationalities
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


        /**
        * Deletes the nationality with the given id
        * @param  id primary key of the nationality you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/Nationalities/
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
