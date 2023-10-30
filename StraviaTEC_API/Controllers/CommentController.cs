using System;
using Microsoft.AspNetCore.Mvc;
using StraviaTEC_API.Models;
using StraviaTEC_API.Services;


namespace StraviaTEC_API.Controllers;

    [Controller]
    [Route("api/[controller]")]
    public class CommentController : Controller {
        private readonly MongoDBService _mongoDBService;
        public CommentController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }
        [HttpGet]
        public async Task<List<Comment>> GetComment() {
            var comment = await _mongoDBService.GetComment();
        Console.WriteLine(comment[0].email + "\n" + comment[0].text + "\n" + comment[0]._id +"\n" + comment[0].date);
        return comment  ;
        }

        [HttpPost]
        public async Task<IActionResult> PostComment([FromBody] Comment comment)
        {

            await _mongoDBService.CreateComment(comment);
            return CreatedAtAction(nameof(GetComment), new {id = comment._id }, comment);

        }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutComment(string id, [FromBody] string movieId)
    {
        await _mongoDBService.AddCommentAsync(id, movieId);
        return NoContent(); 
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteComment(string id) 
    {
        await _mongoDBService.DeleteComment(id);
        return NoContent();
    }
    }

