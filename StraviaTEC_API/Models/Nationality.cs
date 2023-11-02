using StraviaTEC_API.Models;
using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Nationality
{
    public byte Id { get; set; }

    public string Nationality1 { get; set; } = null!;

    public virtual ICollection<Sportman> Sportmen { get; set; } = new List<Sportman>();
}
