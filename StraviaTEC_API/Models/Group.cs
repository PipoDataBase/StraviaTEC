using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Group
{
    public string Name { get; set; } = null!;

    public virtual ICollection<Challenge> ChallengeNames { get; set; } = new List<Challenge>();

    public virtual ICollection<Sportman> Usernames { get; set; } = new List<Sportman>();

    public virtual ICollection<Sportman> UsernamesNavigation { get; set; } = new List<Sportman>();
}
