using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class VwFutureRace
{
    public string Name { get; set; } = null!;

    public decimal InscriptionPrice { get; set; }

    public DateTime Date { get; set; }

    public bool Private { get; set; }

    public string? RoutePath { get; set; }

    public byte Type { get; set; }
}
