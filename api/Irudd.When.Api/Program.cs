using Irudd.When.Api.Methods;
using Irudd.When.Api.Storage;

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
            x.SetIsOriginAllowed(origin => new Uri(origin).IsLoopback);
            x.AllowAnyHeader();
            x.AllowAnyMethod();
        });
    }
});
builder.Services.AddSignalR();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
//app.MapHub<ChatHub>("/chatHub");

var store = new KeyValueStore();

CreateEventMethod.Map(app, store, app.Environment.IsDevelopment());
ExistingEventMethod.Map(app, store);

app.Run();