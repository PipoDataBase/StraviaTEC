using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class VwRace
{
    public string Name { get; set; } = null!;

    public decimal InscriptionPrice { get; set; }

    public DateTime Date { get; set; }

    public bool Private { get; set; }

    public string? RoutePath { get; set; }

    public string Type { get; set; } = null!;

    public string Manager { get; set; } = null!;
}
