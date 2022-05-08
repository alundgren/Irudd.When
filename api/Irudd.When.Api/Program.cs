using Irudd.When.Api.Hubs;
using Irudd.When.Api.Storage;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    if(builder.Environment.IsDevelopment())
    {
        options.AddDefaultPolicy(x =>
        {
            x.AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins(builder.Configuration.GetValue<string>("SiteUrl"))
                .AllowCredentials();
        });
    }
});

builder.Services.AddScoped<EventStore>();
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddDbContext<EventsContext>((_, options) =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("EventsContext"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapHub<EventsHub>("/hubs/events");
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetService<EventsContext>();
    if (context != null)
    {
        EventsContext.EnsureDatabaseCreated(context);

        if (app.Environment.IsDevelopment())
        {
            var storeOperation = serviceScope.ServiceProvider.GetService<EventStore>();
            if (storeOperation != null)
            {
                await storeOperation.AddTestData();    
            }
        }
    }
}

app.Run();