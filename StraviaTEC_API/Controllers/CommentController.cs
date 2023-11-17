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
    public async Task<List<Comment>> GetComments() {
        var comments = await _mongoDBService.GetComment();
    //Console.WriteLine("Comments retrieved");
    return comments  ;
    }


    [HttpGet("{activityId}")]
    public async Task<List<Comment>> GetCommentsByActivity(string activityId)
    {
        var comments = await _mongoDBService.GetComment();
        //Console.WriteLine("activityId= " + activityId);
        //Console.WriteLine("amount of comments:" + comments.Count);

            List<Comment> filteredComments = new List<Comment>();

        for (int i = 0; i < comments.Count; i++)
        {
            if (comments[i].activityId == activityId)
            {
                filteredComments.Add(comments[i]);
            }
            else
            {
                // :)
            }
        }

        return filteredComments;
    }

    [HttpPost]
    public async Task<IActionResult> PostComment([FromBody] Comment comment)
    {

        await _mongoDBService.CreateComment(comment);
        return CreatedAtAction(nameof(GetComments), new {id = comment._id }, comment);

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

