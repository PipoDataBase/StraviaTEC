using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Sponsor
{
    public string TradeName { get; set; } = null!;

    public string? LegalRepresentant { get; set; }

    public decimal? Phone { get; set; }

    public string? LogoPath { get; set; }

    public virtual ICollection<Challenge>? ChallengeNames { get; set; } = new List<Challenge>();

    public virtual ICollection<Race>? RaceNames { get; set; } = new List<Race>();
}
