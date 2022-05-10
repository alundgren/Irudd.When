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

if(!app.Environment.IsProduction())
{
    //In production it runs behind a proxy so ssl termination is done elsewhere
    app.UseHttpsRedirection();
}

app.UseCors();
app.MapHub<EventsHub>("hubs/events");
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

if(app.Environment.IsProduction())
{
    try
    {
        Console.CancelKeyPress += (sender, eventArgs) =>
        {
            app.Logger.LogInformation("Console shutdown supressed");
            // Don't terminate the process immediately, wait for the Main thread to exit gracefully.
            eventArgs.Cancel = true;
        };
        /*
         * Caprover which is used to host this auto triggers app shutdown instantly but this catch seems make it have no effect.
         * No clue why or how this works or why it triggers. 
         * This messages show instantly Application is shutting down... as if Ctrl + C has been used but
         * even when using StartAsync and WaitForShutdownAsync with a cancellation token that never triggers
         * it still dies without the catch. But no error is logged so how the catch can have any effect ... no clue.
         */
        var cancellationTokenSource1 = new CancellationTokenSource();
        await app.StartAsync(cancellationTokenSource1.Token);
        var cancellationTokenSource2 = new CancellationTokenSource();
        await app.WaitForShutdownAsync(cancellationTokenSource2.Token);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Run error");
    }

}
else
{
    app.Run();
}
