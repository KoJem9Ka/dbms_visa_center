﻿using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using VisaCenterBackend.Shared.DB.Entities;

namespace VisaCenterBackend.Shared.DB;

/// Контекст базы данных
public class AppDbContext : DbContext {
  private readonly AppConfigService _appConfig;
  private readonly IWebHostEnvironment _env;
  private readonly ILogger _logger;

  // Конструктор с инъекцией зависимостей: Конфигурация приложения
  public AppDbContext(AppConfigService appConfig, IWebHostEnvironment env, ILogger<AppDbContext> logger) {
    this._appConfig = appConfig;
    this._env = env;
    this._logger = logger;
    this.SavingChanges += this.OnSaveChanges;
    if (_env.IsDevelopment()) {
      Database.EnsureDeleted();
      Database.EnsureCreated();
    }
  }

  private void OnSaveChanges(object? sender, SaveChangesEventArgs args) {
    _logger.LogDebug("Saving Changes...");

    ChangeTracker.DetectChanges();
    foreach (var entry in ChangeTracker.Entries()) {
      // Обновление свойства UpdatedAt до now() при изменении записи
      if (entry is { Entity: AppBaseEntity appBaseEntity, State: EntityState.Modified })
        appBaseEntity.UpdatedAt = DateTime.Now;
      // if (entry.State == EntityState.Modified && entry.Properties.Any(p => p.Metadata.Name == "UpdatedAt"))
      // entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;

      // Если запись это UserEntity и пароль не является хэшем bcrypt - вычислить хэш
      if (entry.Entity is UserEntity userEntity
          && !userEntity.Password.IsNullOrEmpty()
          && !userEntity.Password.StartsWith("$2a$"))
        userEntity.Password = BCrypt.Net.BCrypt.HashPassword(userEntity.Password, 10);
    }
  }

  // Подключение драйвера базы данных
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
    optionsBuilder.UseSqlServer(_appConfig.DefaultConnection);

  // Подключение моделей в контекст
  public DbSet<ConfirmationEmailEntity> ConfirmationEmail { get; set; } = null!;
  public DbSet<ConfirmationPhoneEntity> ConfirmationPhone { get; set; } = null!;
  public DbSet<EmployeeEntity> Employee { get; set; } = null!;
  public DbSet<NotificationEntity> Notification { get; set; } = null!;
  public DbSet<NotificationToUser> NotificationToUser { get; set; } = null!;
  public DbSet<StudentArrivalNoticeEntity> StudentArrivalNotice { get; set; } = null!;
  public DbSet<StudentCloseRelativeEntity> StudentCloseRelative { get; set; } = null!;
  public DbSet<StudentEntity> Student { get; set; } = null!;
  public DbSet<StudentMigrationCardEntity> StudentMigrationCard { get; set; } = null!;
  public DbSet<StudentPassportEntity> StudentPassport { get; set; } = null!;
  public DbSet<StudentVisaEntity> StudentVisa { get; set; } = null!;
  public DbSet<StudentVisaRequestEntity> StudentVisaRequest { get; set; } = null!;
  public DbSet<UserEntity> User { get; set; } = null!;

  // Конфигурация БД и моделей
  protected override void OnModelCreating(ModelBuilder modelBuilder) {
    ///// Конфигурация моделей /////

    modelBuilder.ApplyConfiguration(new ConfirmationEmailEntityConfiguration());
    modelBuilder.ApplyConfiguration(new ConfirmationPhoneEntityConfiguration());
    modelBuilder.ApplyConfiguration(new EmployeeEntityConfiguration());
    modelBuilder.ApplyConfiguration(new NotificationEntityConfiguration());
    modelBuilder.ApplyConfiguration(new NotificationToUserConfiguration());
    modelBuilder.ApplyConfiguration(new StudentArrivalNoticeEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentCloseRelativeEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentMigrationCardEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentPassportEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentVisaEntityConfiguration());
    modelBuilder.ApplyConfiguration(new StudentVisaRequestEntityConfiguration());
    modelBuilder.ApplyConfiguration(new UserEntityConfiguration());

    ///// Seeds /////

    // if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development") return;
    if (!_env.IsDevelopment()) return;
    _logger.LogWarning("Because of Development environment, seeding DB...");

    // Seeding UserEntity
    var user1 = new UserEntity {
      Id = Guid.NewGuid(),
      Email = "admin@mail.ru",
      Password = BCrypt.Net.BCrypt.HashPassword("123", 6),
    };
    var user2 = new UserEntity {
      Id = Guid.NewGuid(),
      Email = "employee@mail.ru",
      Password = BCrypt.Net.BCrypt.HashPassword("321", 6),
    };
    var user3 = new UserEntity {
      Id = Guid.NewGuid(),
      Email = "student@mail.ru",
      Password = BCrypt.Net.BCrypt.HashPassword("123321", 6),
    };
    modelBuilder.Entity<UserEntity>().HasData(user1, user2, user3);

    // Seeding EmployeeEntity
    var employee1 = new EmployeeEntity {
      UserId = user1.Id,
      FirstName = "Иван",
      LastName = "Иванов",
      IsAdmin = true,
    };
    var employee2 = new EmployeeEntity {
      UserId = user2.Id,
      FirstName = "Петр",
      LastName = "Петров",
    };
    modelBuilder.Entity<EmployeeEntity>().HasData(employee1, employee2);

    // Seeding StudentEntity

    var student1 = new StudentEntity {
      UserId = user3.Id,
    };

    // Seeding NotificationEntity
    var notification1 = new NotificationEntity {
      Id = Guid.NewGuid(),
      Title = "Сообщение 1",
      Content = "Тут текст сообщения 1",
      CreatedAt = new DateTime(year: 2023, month: 4, day: 2),
    };
    var notification2 = new NotificationEntity {
      Id = Guid.NewGuid(),
      Title = "Сообщение 2",
      Content = "Тут текст сообщения 2",
      CreatedAt = new DateTime(year: 2023, month: 3, day: 14),
    };
    var notification3 = new NotificationEntity {
      Id = Guid.NewGuid(),
      Title = "Сообщение 3",
      Content = "Тут текст сообщения 3",
      CreatedAt = new DateTime(year: 2023, month: 1, day: 1),
    };
    modelBuilder.Entity<NotificationEntity>().HasData(notification1, notification2, notification3);

    // Seeding NotificationToUser
    var notificationToUser1 = new NotificationToUser { UserId = user1.Id, NotificationId = notification1.Id, IsRead = false };
    var notificationToUser2 = new NotificationToUser { UserId = user2.Id, NotificationId = notification1.Id, IsRead = false };
    var notificationToUser3 = new NotificationToUser { UserId = user1.Id, NotificationId = notification2.Id, IsRead = true };
    var notificationToUser4 = new NotificationToUser { UserId = user1.Id, NotificationId = notification3.Id, IsRead = true };
    modelBuilder.Entity<NotificationToUser>().HasData(notificationToUser1, notificationToUser2, notificationToUser3, notificationToUser4);
  }
}