namespace Irudd.When.Api.Storage;
using Microsoft.EntityFrameworkCore;

public class EventsContext : DbContext
{
    public EventsContext(DbContextOptions<EventsContext> options) : base(options)
    {
    }
    
    public DbSet<StoredEvent> StoredEvents { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var evt = modelBuilder.Entity<StoredEvent>();
        evt.ToTable(TableName);
        evt.HasKey(x => x.EventId);
        evt.Property(x => x.DeleteAfterEpoch).IsRequired();
        evt.Property(x => x.SerializedModelVersion).IsRequired();
    }

    /// <summary>
    /// NOTE: This should be migrations but the migration tool throws
    /// Method 'get_Info' in type 'Microsoft.EntityFrameworkCore.Infrastructure.Internal.SqliteOptionsExtension' from assembly 'Microsoft.EntityFrameworkCore.S
    /// qlite, Version=1.1.6.0, Culture=neutral, PublicKeyToken=adb9793829ddae60' does not have an implementation.
    ///
    /// So this is the least bad workaround I found
    /// </summary>
    public static void EnsureDatabaseCreated(EventsContext context)
    {
        context.Database.EnsureCreated();
        context.Database.ExecuteSqlRaw($"CREATE TABLE IF NOT EXISTS {TableName}  (EventId TEXT PRIMARY KEY, DeleteAfterEpoch NUMBER NOT NULL, SerializedModelVersion NUMBER NOT NULL, SerializedModel NUMBER NOT NULL)");
    }

    private const string TableName = "StoredEventV1";
}