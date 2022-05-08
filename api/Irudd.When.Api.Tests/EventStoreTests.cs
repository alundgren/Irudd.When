using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Irudd.When.Api.Storage;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Xunit;

namespace Irudd.When.Api.Tests;

public class EventStoreTests : IDisposable
{
    private SqliteConnection _connection;
    private DbContextOptions<EventsContext> _contextOptions;
    
    public EventStoreTests()
    {
        _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();
        
        _contextOptions = new DbContextOptionsBuilder<EventsContext>()
            .UseSqlite(_connection)
            .Options;

        using var context = new EventsContext(_contextOptions);
        EventsContext.EnsureDatabaseCreated(context);
    }
    
    private EventsContext CreateContext() => new EventsContext(_contextOptions);
    
    [Fact]
    public async Task SetGetCyclePreservesEvent()
    {
        await using var context = CreateContext();
        var store = new EventStore(context);
        var testEvent = new ExistingEvent("id1", "test1", true, 
            new List<EventParticipant> { new ("p1","n1") }, 
            new List<EventDate> { new("d1", "2022-06-10") },
            new List<ParticipantDateChoice> { new ("d1", "p1", "accepted") });

        await store.SetEvent(testEvent);
        var loadedEvent = await store.GetEvent("id1");
        
        Assert.Equal(JsonConvert.SerializeObject(testEvent), JsonConvert.SerializeObject(loadedEvent));
    }

    [Fact]
    public async Task OnlyTheLatestChoiceIsKept()
    {
        await using var context = CreateContext();
        var store = new EventStore(context);
        var testEvent = new ExistingEvent("id1", "test1", true, 
            new List<EventParticipant> { new ("p1","n1") }, 
            new List<EventDate> { new("d1", "2022-06-10") },
            new List<ParticipantDateChoice> { new ("d1", "p1", "accepted"), new ("d1", "p1", "rejected") });

        await store.SetEvent(testEvent);
        var loadedEvent = await store.GetEvent("id1");
        
        Assert.Equal("rejected", loadedEvent?.ParticipantDateChoices.Single().Choice);
    }

    public void Dispose()
    {
        _connection.Dispose();
    }
}