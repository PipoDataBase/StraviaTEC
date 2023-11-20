using System;
using System.Collections.Generic;
using System.Diagnostics;
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
    public class BillsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public BillsController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Returns all the Bills in the database
        * @return Bill[] list of Bill
        */
        // GET: api/Bills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBills()
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }
            return await _context.Bills.FromSqlRaw("spGetBills").ToListAsync();
        }

        /**
        * Return the Bill according to the given id
        * @param  id it is the primary key ok the Bill you want to get
        * @return Bill
        */
        // GET: api/Bills/
        [HttpGet("{id}")]
        public async Task<ActionResult<Bill>> GetBill(int id)
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }

            var result = await _context.Bills.FromSqlRaw(
                "EXEC spGetBill @Id",
                new SqlParameter("@Id", id)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }


        /**
        * Updates the Bill according to the given id
        * @param  id it is the primary key ok the Bill you want to update
        * @return true if the update was successful
        */
        // PUT: api/Bills/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBill(int id, Bill bill)
        {
            if (id != bill.Id)
            {
                return BadRequest();
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spUpdateBill @Id, @PhotoPath, @Accepted, @Username, @RaceName, @CategoryId",
                    new SqlParameter("@Id", id),
                    new SqlParameter("@PhotoPath", bill.PhotoPath),
                    new SqlParameter("@Accepted", bill.Accepted),
                    new SqlParameter("@Username", bill.Username),
                    new SqlParameter("@RaceName", bill.RaceName),
                    new SqlParameter("@CategoryId", bill.CategoryId)
                    );
                return Ok("Bill Updated");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillExists(id))
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
        * Turns true the Accepted parameter of the given Bill. 
        * That sets the User owner of the bill as a participant of the
        * respective race
        * @param  id it is the primary key ok the Bill you want to Accept
        * @return true if the update was successful
        */
        // PUT: api/Bills/
        [HttpPut("AcceptBill/{id}")]
        public async Task<IActionResult> PutAcceptBill(int id)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spAcceptBill @Id",
                    new SqlParameter("@Id", id)
                    );
                return Ok(true);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        /**
        * Return the Bill according to the given id
        * @param  Bill it is the Bill you want to insert into the database
        * @return true if the insert was successful
        */
        // POST: api/Bills
        [HttpPost]
        public async Task<ActionResult<Bill>> PostBill(Bill bill)
        {
          if (_context.Bills == null)
          {
              return Problem("Entity set 'StraviaTecContext.Bills'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertBill @PhotoPath, @Username, @RaceName, @CategoryId",
                    new SqlParameter("@PhotoPath", bill.PhotoPath),
                    new SqlParameter("@Username", bill.Username),
                    new SqlParameter("@RaceName", bill.RaceName),
                    new SqlParameter("@CategoryId", bill.CategoryId)
                    );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the Bill withe given id
        * @param  id it is the primary key ok the Bill you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/Bills/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            if (_context.Bills == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteBill @Id",
                new SqlParameter("@Id", id)
                );

            return Ok(true);
        }

        private bool BillExists(int id)
        {
            return (_context.Bills?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
