using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class Race
{
    public string Name { get; set; } = null!;

    public decimal InscriptionPrice { get; set; }

    public DateTime Date { get; set; }

    public bool Private { get; set; }

    public string? RoutePath { get; set; } = null!;

    public virtual ICollection<Activity>? Activities { get; set; } = new List<Activity>();

    public virtual BankAccount? BankAccount { get; set; }

    public virtual ICollection<Bill>? Bills { get; set; } = new List<Bill>();

    public virtual ICollection<Category>? Categories { get; set; } = new List<Category>();

    public virtual ICollection<Sponsor>? SponsorTradeNames { get; set; } = new List<Sponsor>();

    public virtual ICollection<Sportman>? Usernames { get; set; } = new List<Sportman>();
}
