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
    public class ChallengesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public ChallengesController(StraviaTecContext context)
        {
            _context = context;
        }

        // GET: api/Challenges
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Challenge>>> GetChallenges()
        {
          if (_context.Challenges == null)
          {
              return NotFound();
          }
            return await _context.Challenges.FromSqlRaw("spGetChallenges").ToListAsync();
        }

        // GET: api/Challenges/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Challenge>> GetChallenge(string name)
        {
          if (_context.Challenges == null)
          {
              return NotFound();
          }
            var result = await _context.Challenges.FromSqlRaw($"spGetChallenge {name}").ToListAsync();
            return Ok(result);

        }

        // PUT: api/Challenges/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChallenge(string name, Challenge challenge)
        {
            if (name != challenge.Name)
            {
                return BadRequest();
            }

           

            try
            {
                var result = await _context.Challenges.FromSqlRaw($"spUpdateChallenge {name}, {challenge.Goal}, {challenge.Private}, {challenge.StartDate}, {challenge.EndDate}, {challenge.Deep}, {challenge.Type}").ToListAsync();
                return Ok(result);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChallengeExists(name))
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

        // POST: api/Challenges
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Challenge>> PostChallenge(Challenge challenge)
        {
          if (_context.Challenges == null)
          {
              return Problem("Entity set 'StraviaTecContext.Challenges'  is null.");
          }
            
            try
            {
                await _context.Challenges.FromSqlRaw($"spInsertChallenge {challenge.Name}, {challenge.Goal}, {challenge.Private}, {challenge.StartDate}, {challenge.EndDate}, {challenge.Deep}, {challenge.Type}").ToListAsync();
                return challenge;
            }
            catch (DbUpdateException)
            {
                if (ChallengeExists(challenge.Name))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetChallenge", new { id = challenge.Name }, challenge);
        }

        // DELETE: api/Challenges/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChallenge(string name)
        {
            if (_context.Challenges == null)
            {
                return NotFound();
            }
            var challenge = await _context.Challenges.FindAsync(name);
            if (challenge == null)
            {
                return NotFound();
            }

            var result = await _context.Challenges.FromSqlRaw($"spDeleteChallenge {name}").ToListAsync();

            return NoContent();
        }

        private bool ChallengeExists(string id)
        {
            return (_context.Challenges?.Any(e => e.Name == id)).GetValueOrDefault();
        }
    }
}
