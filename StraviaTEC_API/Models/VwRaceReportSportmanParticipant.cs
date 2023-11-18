using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class VwRaceReportSportmanParticipant
{
    public string Username { get; set; } = null!;

    public string? Name { get; set; }

    public string? LastName1 { get; set; }

    public string? LastName2 { get; set; }

    public int? Age { get; set; }

    public string? PhotoPath { get; set; }

    public string Nationality { get; set; } = null!;

    public string Category { get; set; } = null!;
}
