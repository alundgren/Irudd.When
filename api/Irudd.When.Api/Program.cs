using Irudd.When.Api.Methods;
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
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapHub<EventsHub>("/hubs/events");

var store = new KeyValueStore();

CreateEventMethod.Map(app, store, app.Environment.IsDevelopment());
ExistingEventMethod.Map(app, store);
SetParticipantDateChoiceMethod.Map(app, store, app.Services.GetRequiredService<IHubContext<EventsHub>>());

app.Run();