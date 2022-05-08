using System;
using Irudd.When.Api.Storage;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Irudd.When.Api.Tests;

public class UnitTest1 : IDisposable
{
    private SqliteConnection _connection;
    private DbContextOptions<EventsContext> _contextOptions;
    
    public UnitTest1()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();
        
        _contextOptions = new DbContextOptionsBuilder<EventsContext>()
            .UseSqlite(_connection)
            .Options;

        using var context = new EventsContext(_contextOptions);

        //if (context.Database.EnsureCreated())
        //{
//             using var viewCommand = context.Database.GetDbConnection().CreateCommand();
//             viewCommand.CommandText = @"
// CREATE VIEW AllResources AS
// SELECT Url
// FROM Blogs;";
//             viewCommand.ExecuteNonQuery();
//         }
//
//         context.AddRange(
//             new Blog { Name = "Blog1", Url = "http://blog1.com" },
//             new Blog { Name = "Blog2", Url = "http://blog2.com" });
       // context.SaveChanges();

    }
    
    private EventsContext CreateContext() => new EventsContext(_contextOptions);
    
    [Fact]
    public void Test1()
    {
    
    }

    public void Dispose()
    {
        _connection.Dispose();
    }
}