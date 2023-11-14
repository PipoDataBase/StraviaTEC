using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace StraviaTEC_API.Models;

public partial class StraviaTecContext : DbContext
{
    public StraviaTecContext()
    {
    }

    public StraviaTecContext(DbContextOptions<StraviaTecContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Activity> Activities { get; set; }

    public virtual DbSet<ActivityType> ActivityTypes { get; set; }

    public virtual DbSet<BankAccount> BankAccounts { get; set; }

    public virtual DbSet<Bill> Bills { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Challenge> Challenges { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<Nationality> Nationalities { get; set; }

    public virtual DbSet<Race> Races { get; set; }

    public virtual DbSet<Sponsor> Sponsors { get; set; }

    public virtual DbSet<Sportman> Sportmen { get; set; }

    public virtual DbSet<VwActiveChallenge> VwActiveChallenges { get; set; }

    public virtual DbSet<VwChallengesByManager> VwChallengesByManagers { get; set; }

    public virtual DbSet<VwFutureChallenge> VwFutureChallenges { get; set; }

    public virtual DbSet<VwFutureRace> VwFutureRaces { get; set; }

    public virtual DbSet<VwPastChallenge> VwPastChallenges { get; set; }

    public virtual DbSet<VwSportmanNationality> VwSportmanNationalities { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server=DESKTOP-VEB3CKO; database=StraviaTEC; integrated security=true; Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Activity__3214EC07F64628B9");

            entity.ToTable("Activity");

            entity.Property(e => e.ChallengeName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.Duration).HasPrecision(0);
            entity.Property(e => e.Kilometers).HasColumnType("numeric(10, 3)");
            entity.Property(e => e.RaceName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.RoutePath).IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.ChallengeNameNavigation).WithMany(p => p.Activities)
                .HasForeignKey(d => d.ChallengeName)
                .HasConstraintName("Activity_fk1");

            entity.HasOne(d => d.RaceNameNavigation).WithMany(p => p.Activities)
                .HasForeignKey(d => d.RaceName)
                .HasConstraintName("Activity_fk3");

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Activities)
                .HasForeignKey(d => d.Type)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Activity_fk2");

            entity.HasOne(d => d.UsernameNavigation).WithMany(p => p.Activities)
                .HasForeignKey(d => d.Username)
                .HasConstraintName("Activity_fk0");
        });

        modelBuilder.Entity<ActivityType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Activity__3214EC07E0A53D1A");

            entity.ToTable("ActivityType");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<BankAccount>(entity =>
        {
            entity.HasKey(e => new { e.BankAccount1, e.RaceName }).HasName("PK__BankAcco__019ADEDBDA90FC5F");

            entity.ToTable("BankAccount");

            entity.Property(e => e.BankAccount1)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("BankAccount");
            entity.Property(e => e.RaceName)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.RaceNameNavigation).WithMany(p => p.BankAccounts)
                .HasForeignKey(d => d.RaceName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("BankAccount_fk0");
        });

        modelBuilder.Entity<Bill>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Bill__3214EC076268BF5D");

            entity.ToTable("Bill");

            entity.Property(e => e.PhotoPath).IsUnicode(false);
            entity.Property(e => e.RaceName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.RaceNameNavigation).WithMany(p => p.Bills)
                .HasForeignKey(d => d.RaceName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Bill_fk0");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3214EC07D394F8F9");

            entity.ToTable("Category");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Category1)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Category");
        });

        modelBuilder.Entity<Challenge>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("PK__Challeng__737584F762A6D1E0");

            entity.ToTable("Challenge");

            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Goal).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.StartDate).HasColumnType("datetime");

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Challenges)
                .HasForeignKey(d => d.Type)
                .HasConstraintName("Challenge_fk0");

            entity.HasMany(d => d.GroupNames).WithMany(p => p.ChallengeNames)
                .UsingEntity<Dictionary<string, object>>(
                    "ChallengeGroup",
                    r => r.HasOne<Group>().WithMany()
                        .HasForeignKey("GroupName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeGroup_fk1"),
                    l => l.HasOne<Challenge>().WithMany()
                        .HasForeignKey("ChallengeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeGroup_fk0"),
                    j =>
                    {
                        j.HasKey("ChallengeName", "GroupName").HasName("PK__Challeng__D61F7579DF30D6F3");
                        j.ToTable("ChallengeGroup");
                        j.IndexerProperty<string>("ChallengeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("GroupName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.SportmanUsernames).WithMany(p => p.ChallengeNames)
                .UsingEntity<Dictionary<string, object>>(
                    "ChallengeSportmanManager",
                    r => r.HasOne<Sportman>().WithMany()
                        .HasForeignKey("SportmanUsername")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSportmanManager_fk1"),
                    l => l.HasOne<Challenge>().WithMany()
                        .HasForeignKey("ChallengeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSportmanManager_fk0"),
                    j =>
                    {
                        j.HasKey("ChallengeName", "SportmanUsername").HasName("PK__Challeng__970EF6F7B772BB6A");
                        j.ToTable("ChallengeSportmanManager");
                        j.IndexerProperty<string>("ChallengeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("SportmanUsername")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.SportmanUsernamesNavigation).WithMany(p => p.ChallengeNamesNavigation)
                .UsingEntity<Dictionary<string, object>>(
                    "ChallengeSportmanParticipant",
                    r => r.HasOne<Sportman>().WithMany()
                        .HasForeignKey("SportmanUsername")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSportmanParticipant_fk1"),
                    l => l.HasOne<Challenge>().WithMany()
                        .HasForeignKey("ChallengeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSportmanParticipant_fk0"),
                    j =>
                    {
                        j.HasKey("ChallengeName", "SportmanUsername").HasName("PK__Challeng__970EF6F7EFE0751A");
                        j.ToTable("ChallengeSportmanParticipant");
                        j.IndexerProperty<string>("ChallengeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("SportmanUsername")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("PK__Group___737584F7CB136EA3");

            entity.ToTable("Group_");

            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Nationality>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__National__3214EC07487EDD5F");

            entity.ToTable("Nationality");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Nationality1)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Nationality");
        });

        modelBuilder.Entity<Race>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("PK__Race__737584F794ED2178");

            entity.ToTable("Race");

            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.InscriptionPrice).HasColumnType("numeric(6, 0)");
            entity.Property(e => e.RoutePath).IsUnicode(false);

            entity.HasOne(d => d.TypeNavigation).WithMany(p => p.Races)
                .HasForeignKey(d => d.Type)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Race_fk0");

            entity.HasMany(d => d.Categories).WithMany(p => p.RaceNames)
                .UsingEntity<Dictionary<string, object>>(
                    "RaceCategory",
                    r => r.HasOne<Category>().WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceCategory_fk1"),
                    l => l.HasOne<Race>().WithMany()
                        .HasForeignKey("RaceName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceCategory_fk0"),
                    j =>
                    {
                        j.HasKey("RaceName", "CategoryId").HasName("PK__RaceCate__AE58EABFC94D08E6");
                        j.ToTable("RaceCategory");
                        j.IndexerProperty<string>("RaceName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<Sponsor>(entity =>
        {
            entity.HasKey(e => e.TradeName).HasName("PK__Sponsor__6675EB9C68A33344");

            entity.ToTable("Sponsor");

            entity.Property(e => e.TradeName)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LegalRepresentant)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LogoPath).IsUnicode(false);
            entity.Property(e => e.Phone).HasColumnType("numeric(8, 0)");

            entity.HasMany(d => d.ChallengeNames).WithMany(p => p.SponsorTradeNames)
                .UsingEntity<Dictionary<string, object>>(
                    "ChallengeSponsor",
                    r => r.HasOne<Challenge>().WithMany()
                        .HasForeignKey("ChallengeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSponsor_fk1"),
                    l => l.HasOne<Sponsor>().WithMany()
                        .HasForeignKey("SponsorTradeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("ChallengeSponsor_fk0"),
                    j =>
                    {
                        j.HasKey("SponsorTradeName", "ChallengeName").HasName("PK__Challeng__DEC4BC7CD6169DDC");
                        j.ToTable("ChallengeSponsor");
                        j.IndexerProperty<string>("SponsorTradeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("ChallengeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.RaceNames).WithMany(p => p.SponsorTradeNames)
                .UsingEntity<Dictionary<string, object>>(
                    "RaceSponsor",
                    r => r.HasOne<Race>().WithMany()
                        .HasForeignKey("RaceName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceSponsor_fk1"),
                    l => l.HasOne<Sponsor>().WithMany()
                        .HasForeignKey("SponsorTradeName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceSponsor_fk0"),
                    j =>
                    {
                        j.HasKey("SponsorTradeName", "RaceName").HasName("PK__RaceSpon__8737306E494B6BAA");
                        j.ToTable("RaceSponsor");
                        j.IndexerProperty<string>("SponsorTradeName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("RaceName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<Sportman>(entity =>
        {
            entity.HasKey(e => e.Username).HasName("PK__Sportman__536C85E54C760361");

            entity.ToTable("Sportman");

            entity.Property(e => e.Username)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BirthDate).HasColumnType("date");
            entity.Property(e => e.LastName1)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LastName2)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PhotoPath).IsUnicode(false);

            entity.HasOne(d => d.NationalityNavigation).WithMany(p => p.Sportmen)
                .HasForeignKey(d => d.Nationality)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Sportman_fk0");

            entity.HasMany(d => d.FriendUsernames).WithMany(p => p.Usernames)
                .UsingEntity<Dictionary<string, object>>(
                    "Friend",
                    r => r.HasOne<Sportman>().WithMany()
                        .HasForeignKey("FriendUsername")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Friend_fk1"),
                    l => l.HasOne<Sportman>().WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Friend_fk0"),
                    j =>
                    {
                        j.HasKey("Username", "FriendUsername").HasName("PK__Friend__22FE87B4CC709FF0");
                        j.ToTable("Friend");
                        j.IndexerProperty<string>("Username")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("FriendUsername")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.GroupNames).WithMany(p => p.Usernames)
                .UsingEntity<Dictionary<string, object>>(
                    "GroupManager",
                    r => r.HasOne<Group>().WithMany()
                        .HasForeignKey("GroupName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("GroupManager_fk1"),
                    l => l.HasOne<Sportman>().WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("GroupManager_fk0"),
                    j =>
                    {
                        j.HasKey("Username", "GroupName").HasName("PK__GroupMan__158348A6A7DC569A");
                        j.ToTable("GroupManager");
                        j.IndexerProperty<string>("Username")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("GroupName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.GroupNamesNavigation).WithMany(p => p.UsernamesNavigation)
                .UsingEntity<Dictionary<string, object>>(
                    "SportmanGroup",
                    r => r.HasOne<Group>().WithMany()
                        .HasForeignKey("GroupName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("SportmanGroup_fk1"),
                    l => l.HasOne<Sportman>().WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("SportmanGroup_fk0"),
                    j =>
                    {
                        j.HasKey("Username", "GroupName").HasName("PK__Sportman__158348A6C714826A");
                        j.ToTable("SportmanGroup");
                        j.IndexerProperty<string>("Username")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("GroupName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.RaceNames).WithMany(p => p.Usernames)
                .UsingEntity<Dictionary<string, object>>(
                    "RaceSportman",
                    r => r.HasOne<Race>().WithMany()
                        .HasForeignKey("RaceName")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceSportman_fk1"),
                    l => l.HasOne<Sportman>().WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RaceSportman_fk0"),
                    j =>
                    {
                        j.HasKey("Username", "RaceName").HasName("PK__RaceSpor__B39002747171C057");
                        j.ToTable("RaceSportman");
                        j.IndexerProperty<string>("Username")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("RaceName")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });

            entity.HasMany(d => d.Usernames).WithMany(p => p.FriendUsernames)
                .UsingEntity<Dictionary<string, object>>(
                    "Friend",
                    r => r.HasOne<Sportman>().WithMany()
                        .HasForeignKey("Username")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Friend_fk0"),
                    l => l.HasOne<Sportman>().WithMany()
                        .HasForeignKey("FriendUsername")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Friend_fk1"),
                    j =>
                    {
                        j.HasKey("Username", "FriendUsername").HasName("PK__Friend__22FE87B4CC709FF0");
                        j.ToTable("Friend");
                        j.IndexerProperty<string>("Username")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("FriendUsername")
                            .HasMaxLength(20)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<VwActiveChallenge>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwActiveChallenges");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Goal).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwChallengesByManager>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwChallengesByManager");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Goal).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.SportmanUsername)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<VwFutureChallenge>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwFutureChallenges");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Goal).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwFutureRace>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwFutureRaces");

            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.InscriptionPrice).HasColumnType("numeric(6, 0)");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.RoutePath).IsUnicode(false);
        });

        modelBuilder.Entity<VwPastChallenge>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwPastChallenges");

            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.Goal).HasColumnType("numeric(12, 3)");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<VwSportmanNationality>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vwSportmanNationality");

            entity.Property(e => e.BirthDate).HasColumnType("date");
            entity.Property(e => e.LastName1)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.LastName2)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Nationality)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PhotoPath).IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
