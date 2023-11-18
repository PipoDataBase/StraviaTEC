
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;


namespace StraviaTEC_API.Models{ 
    public class Comment
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }
        public string name {  get; set; } 
        public string email {  get; set; }
        public string activityId { get; set; }
        public string text { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Local, Representation =BsonType.Document)]
        public DateTime date { get; set;}
    }
}

