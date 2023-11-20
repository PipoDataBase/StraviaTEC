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
    public class CategoriesController : ControllerBase
    {
        private readonly StraviaTecContext _context;

        public CategoriesController(StraviaTecContext context)
        {
            _context = context;
        }

        /**
        * Return the all Categories in the database
        * @return Category[] list of Category
        */
        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
          if (_context.Categories == null)
          {
              return NotFound();
          }
            return await _context.Categories.FromSqlRaw("spGetCategories").ToListAsync();
        }

        /**
        * Return the Category according to the given id
        * @param  id it is the primary key ok the Category you want to get
        * @return Category
        */
        // GET: api/Categories/
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(byte id)
        {
          if (_context.Categories == null)
          {
              return NotFound();
          }
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            var result = await _context.Categories.FromSqlRaw(
                    "EXEC spGetCategory @Id",
                    new SqlParameter("@Id", id)
                    ).ToListAsync();

            if (result.IsNullOrEmpty())
            {
                return NotFound();
            }

            return Ok(result[0]);
        }

        /**
        * Updates the Category according to the given id and data 
        * @param  id it is the primary key ok the Category you want to update
        * @return true if the update was successful
        */
        // PUT: api/Categories/
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(byte id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                 "EXEC spUpdateCategory @Id, @MinimumAge, @MaximumAge, @Category",
                 new SqlParameter("@Id", id),
                 new SqlParameter("@MinimumAge", category.MinimumAge),
                 new SqlParameter("@MaximumAge", category.MaximumAge),
                 new SqlParameter("@Category", category.Category1)
                 );
                return Ok("Category Updated");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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
        * Inserts the given Category into the database
        * @param  Category it is the category you wanto to inser into the database
        * @return true if the insert was successful
        */
        // POST: api/Categories
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
          if (_context.Categories == null)
          {
              return Problem("Entity set 'StraviaTecContext.Categories'  is null.");
          }
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC spInsertCategory @MinimumAge, @MaximumAge, @Category",
                    new SqlParameter("@MinimumAge", category.MinimumAge),
                    new SqlParameter("@MaximumAge", category.MaximumAge),
                    new SqlParameter("@Category", category.Category1)
                    );
                return Ok("Category Created");
            }
            catch (DbUpdateException)
            {
                if (CategoryExists(category.Id))
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
        * Deletes the Category according to the given id
        * @param  id it is the primary key ok the Category you want to delete
        * @return true if the deletion was successful
        */
        // DELETE: api/Categories/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(byte id)
        {
            if (_context.Categories == null)
            {
                return NotFound();
            }
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC spDeleteCategory @Id",
                new SqlParameter("@Id", id)
                );
            return Ok("Category deleted");
        }

        private bool CategoryExists(byte id)
        {
            return (_context.Categories?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
