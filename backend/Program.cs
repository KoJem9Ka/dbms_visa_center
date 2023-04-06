using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using VisaCenterBackend.Modules.AuthModule;
using VisaCenterBackend.Shared;
using VisaCenterBackend.Shared.DB;
using VisaCenterBackend.Shared.DB.Entities;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();
builder.Services.AddAuthentication("Cookie")
    .AddCookie("Cookie", config =>
    {
        config.LoginPath = "/Admin/Login";
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>();  // Подключение к БД

// Добавление различных сервисов
builder.Services.AddTransient<AppConfigService>();

// Глобальная конфигурация JSON сериализации: игнорирование циклических ссылок
builder.Services.AddControllers().AddJsonOptions(options => {
  options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Добавление ролей
builder.Services.AddAuthorization(options => {
  options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
  options.AddPolicy("Employee", policy => policy.RequireRole("Employee"));
  options.AddPolicy("Student", policy => policy.RequireRole("Student"));
});

// Включение CORS
// TODO: Нужно разобраться, как это делать безопасно. Т.к. скорее всего здесь он включается для любого домена
builder.Services.AddCors(c => { c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); });

// Подключение JWT аутентификации
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
  var accessTokenSecret = builder.Configuration.GetValue<string>("accessTokenSecret");
  if (string.IsNullOrEmpty(accessTokenSecret))
    throw new Exception("Не указан accessTokenSecret в конфигурации");
  options.TokenValidationParameters = new TokenValidationParameters() {
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(accessTokenSecret)),
    ValidateIssuerSigningKey = true,
  };
});

var app = builder.Build();

// Enable CORS
// TODO: Нужно разобраться, как это делать безопасно. Т.к. скорее всего здесь он включается для любого домена
app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

// Получение данных
// TODO: нужно убрать это отсюда
app.MapGet(pattern: "/User", handler: (AppDbContext db) => db.User.ToList());
app.MapGet(pattern: "/Emp", handler: (AppDbContext db) => db.Employee.ToList());
app.MapGet(pattern: "/Stud", handler: (AppDbContext db) => db.Student.ToList());
app.MapGet(pattern: "/NotificationToUser", handler: (AppDbContext db) => db.NotificationToUser.ToList());
app.MapGet(pattern: "/Notification", handler: (AppDbContext db) => db.Notification.ToList());

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();