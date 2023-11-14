using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Challenge
{
    public string Name { get; set; } = null!;

    public decimal Goal { get; set; }

    public bool Private { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool Deep { get; set; }

    public byte? Type { get; set; }

    public virtual ICollection<Activity>? Activities { get; set; } = new List<Activity>();

    public virtual ActivityType? TypeNavigation { get; set; }

    public virtual ICollection<Group>? GroupNames { get; set; } = new List<Group>();

    public virtual ICollection<Sponsor>? SponsorTradeNames { get; set; } = new List<Sponsor>();

    public virtual ICollection<Sportman>? SportmanUsernames { get; set; } = new List<Sportman>();

    public virtual ICollection<Sportman>? SportmanUsernamesNavigation { get; set; } = new List<Sportman>();
}
