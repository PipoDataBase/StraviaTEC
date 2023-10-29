using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Bill
{
    public int Id { get; set; }

    public string? PhotoPath { get; set; } = null!;

    public bool Accepted { get; set; }

    public string Username { get; set; } = null!;

    public string RaceName { get; set; } = null!;

    public virtual Race? RaceNameNavigation { get; set; } = null!;
}
