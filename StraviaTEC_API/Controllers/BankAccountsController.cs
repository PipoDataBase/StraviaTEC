﻿using System;
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
    public class BankAccountsController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public BankAccountsController(StraviaTecContext context)
        {
            _context = context;
        }

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

        // GET: api/BankAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BankAccount>> GetBankAccount(string id)
        {
          if (_context.BankAccounts == null)
          {
              return NotFound();
          }
          var result = await _context.BankAccounts.FromSqlRaw($"spGetBankAccount {id}").ToListAsync();
          return Ok(result);
        }

        // POST: api/BankAccounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
                return Ok("BankAccount Created");
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

        // DELETE: api/BankAccounts/5
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
            return Ok("BankAccount deleted");
        }

        private bool BankAccountExists(string id)
        {
            return (_context.BankAccounts?.Any(e => e.BankAccount1 == id)).GetValueOrDefault();
        }
    }
}