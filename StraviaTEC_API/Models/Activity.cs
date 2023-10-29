using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Activity
{
    public int Id { get; set; }

    public decimal Kilometers { get; set; }

    public TimeSpan Duration { get; set; }

    public DateTime Date { get; set; }

    public string? RoutePath { get; set; } = null!;

    public string? Username { get; set; }

    public string? RaceName { get; set; }

    public string? ChallengeName { get; set; }

    public byte? Type { get; set; }

    public virtual Challenge? ChallengeNameNavigation { get; set; }

    public virtual Race? RaceNameNavigation { get; set; }

    public virtual ActivityType? TypeNavigation { get; set; }

    public virtual Sportman? UsernameNavigation { get; set; }
}
