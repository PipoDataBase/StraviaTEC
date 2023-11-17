using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Category
{
    public byte Id { get; set; }

    public byte MinimumAge { get; set; }

    public byte MaximumAge { get; set; }

    public string Category1 { get; set; } = null!;

    public virtual ICollection<Bill>? Bills { get; set; } = new List<Bill>();

    public virtual ICollection<Race>? RaceNames { get; set; } = new List<Race>();
}
