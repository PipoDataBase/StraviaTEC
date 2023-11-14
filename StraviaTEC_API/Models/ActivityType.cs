using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class ActivityType
{
    public byte Id { get; set; }

    public string Type { get; set; } = null!;

    public virtual ICollection<Activity>? Activities { get; set; } = new List<Activity>();

    public virtual ICollection<Challenge>? Challenges { get; set; } = new List<Challenge>();

    public virtual ICollection<Race>? Races { get; set; } = new List<Race>();
}
