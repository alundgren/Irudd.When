using Irudd.When.Api.Controllers;
using Irudd.When.Api.Hubs;
using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

var store = new KeyValueStore();
builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddSingleton(store);

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

if (app.Environment.IsDevelopment())
{
    store.AddTestData();    
}

app.Run();