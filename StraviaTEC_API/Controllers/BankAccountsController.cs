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
    public class BankAccountsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public BankAccountsController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Retuns all the existing BankAccounts from the database
        * @return BankAccount[] list of BankAccount 
        */
        // GET: api/BankAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BankAccount>>> GetBankAccounts()
        {
          if (_context.BankAccounts == null)
          {
              return NotFound();
          }
            return await _context.BankAccounts.FromSqlRaw("spGetBankAccounts").ToListAsync();
        }

        /**
        * Return the BankAccount object that have the provided id
        * @param  id it is the primary key ok the bankAccount you want to get
        * @return BankAccount object
        */
        // GET: api/BankAccounts/
        [HttpGet("{id}")]
        public async Task<ActionResult<BankAccount>> GetBankAccount(string id)
        {
            if (_context.BankAccounts == null)
            {
                return NotFound();
            }

            var result = await _context.BankAccounts.FromSqlRaw(
                "EXEC spGetBankAccount @RaceName",
                new SqlParameter("@RaceName", id)
                ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Insert the provided BankAccount to the database
        * @param  bankAccount it the bankAccount that you want to insert in the database
        * @return true if the insert was successful or raise an error if it failed
        */
        // POST: api/BankAccounts
        [HttpPost]
        public async Task<ActionResult<BankAccount>> PostBankAccount(BankAccount bankAccount)
        {
          if (_context.BankAccounts == null)
          {
              return Problem("Entity set 'StraviaTecContext.BankAccounts'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spInsertBankAccount @BankAccount, @RaceName",
                        new SqlParameter("@BankAccount", bankAccount.BankAccount1),
                        new SqlParameter("@RaceName", bankAccount.RaceName)
                        );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                if (BankAccountExists(bankAccount.BankAccount1))
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
        * Updated the provided BankAccount
        * @param  bankAccount it is the primary key ok the bankAccount you want to update
        * @param raceName it is the primary and foreign key of the bankAccount you want to update
        * @param newBankAccount it is the new data you want to upload
        * @return true if the update was successful
        */
        // PUT: api/BankAccounts
        [HttpPost("{bankAccount}/{raceName}/{newBankAccount}")]
        public async Task<ActionResult<BankAccount>> PutBankAccount(string bankAccount, string raceName, string newBankAccount)
        {
            if (_context.BankAccounts == null)
            {
                return Problem("Entity set 'StraviaTecContext.BankAccounts'  is null.");
            }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                        "EXEC spUpdateBankAccount @BankAccount, @RaceName, @NewBankAccount",
                        new SqlParameter("@BankAccount", bankAccount),
                        new SqlParameter("@RaceName", raceName),
                        new SqlParameter("@NewBankAccount", newBankAccount)
                        );
                return Ok(true);
            }
            catch (DbUpdateException)
            {
                throw;
            }
        }

        /**
        * Deletes the provided bankAccount
        * @param  bankAccount it is the primary key ok the bankAccount you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/BankAccounts/
        [HttpDelete]
        public async Task<IActionResult> DeleteBankAccount(BankAccount bankAccount)
        {
            if (_context.BankAccounts == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteBankAccount @BankAccount, @RaceName",
                new SqlParameter("@BankAccount", bankAccount.BankAccount1),
                new SqlParameter("@RaceName", bankAccount.RaceName)
            );
            return Ok(true);
        }

        /**
        * Deletes the provided bankAccount
        * @param  bankAccount it is the primary key ok the bankAccount you want to delete
        * @param raceName it is the primary and foreign key of the bankAccount you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/BankAccounts/5
        [HttpDelete("{bankAccount}/{raceName}")]
        public async Task<IActionResult> DeleteBankAccount(string bankAccount, string raceName)
        {
            if (_context.BankAccounts == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteBankAccount @BankAccount, @RaceName",
                new SqlParameter("@BankAccount", bankAccount),
                new SqlParameter("@RaceName", raceName)
            );
            return Ok(true);
        }

        private bool BankAccountExists(string id)
        {
            return (_context.BankAccounts?.Any(e => e.BankAccount1 == id)).GetValueOrDefault();
        }
    }
}
