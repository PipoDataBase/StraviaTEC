using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Sportman
{
    public string Username { get; set; } = null!;

    public string? Name { get; set; }

    public string? LastName1 { get; set; }

    public string? LastName2 { get; set; }

    public DateTime BirthDate { get; set; }

    public string? PhotoPath { get; set; }

    public string Password { get; set; } = null!;

    public string Nationality { get; set; } = null!;

    public virtual ICollection<Activity>? Activities { get; set; } = new List<Activity>();

    public virtual ICollection<Sportman>? FriendUsernames { get; set; } = new List<Sportman>();

    public virtual ICollection<Group>? GroupNames { get; set; } = new List<Group>();

    public virtual ICollection<Group>? GroupNamesNavigation { get; set; } = new List<Group>();

    public virtual ICollection<Race>? RaceNames { get; set; } = new List<Race>();

    public virtual ICollection<Sportman>? Usernames { get; set; } = new List<Sportman>();
}
