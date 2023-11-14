using System;
using System.Collections.Generic;

namespace StraviaTEC_API.Models;

public partial class BankAccount
{
    public string BankAccount1 { get; set; } = null!;

    public string RaceName { get; set; } = null!;

    public virtual Race RaceNameNavigation { get; set; } = null!;
}
