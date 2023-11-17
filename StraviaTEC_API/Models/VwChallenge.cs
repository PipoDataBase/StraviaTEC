using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class VwChallenge
{
    public string Name { get; set; } = null!;

    public decimal Goal { get; set; }

    public bool Private { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool Deep { get; set; }

    public string Type { get; set; } = null!;

    public string Manager { get; set; } = null!;
}
