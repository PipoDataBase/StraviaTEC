﻿using System;
using System.Collections.Generic;

namespace ParaSportman.Models;

public partial class VwSportmanNationality
{
    public string Username { get; set; } = null!;

    public string? Name { get; set; }

    public string? LastName1 { get; set; }

    public string? LastName2 { get; set; }

    public DateTime BirthDate { get; set; }

    public string? PhotoPath { get; set; }

    public string Nationality { get; set; } = null!;
}
