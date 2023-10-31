using StraviaTEC_API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;

namespace StraviaTEC_API.Services
{
    public class MongoDBService
    {
        //S
        private readonly IMongoCollection<Comment> _CommentCollection;

        public MongoDBService(IOptions<MongoDBSettings> MongoDBSettings) {
            var connectionString = MongoDBSettings.Value.ConnectionURI;
            MongoClient client = new MongoClient(MongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(MongoDBSettings.Value.DatabaseName);
            _CommentCollection = database.GetCollection<Comment>(MongoDBSettings.Value.CollectionName);
        }


        public async Task CreateComment (Comment comment)
        {
            await _CommentCollection.InsertOneAsync(comment);
            return;
        }

        public async Task<List<Comment>> GetComment()
        {
            return await _CommentCollection.Find(new BsonDocument()).ToListAsync();
        }
        public async Task<List<Comment>> GetCommentsFromActivity(string activityId)
        {
            return await _CommentCollection.Find(Builders<Comment>.Filter.Eq("activityId",activityId)).ToListAsync();
        }

        public async Task DeleteComment (string id) 
        {
            FilterDefinition<Comment> filter = Builders<Comment>.Filter.Eq("Id", id);
            await _CommentCollection.DeleteOneAsync(filter);
            return;
        }

        public async Task AddCommentAsync(string id, string commentId)
        {
            FilterDefinition<Comment> filter = Builders<Comment>.Filter.Eq("Id", id);
            UpdateDefinition<Comment> update = Builders<Comment>.Update.AddToSet<string>("commentId", commentId);
            await _CommentCollection.UpdateOneAsync(filter, update);
            return;
        }
    }
}
