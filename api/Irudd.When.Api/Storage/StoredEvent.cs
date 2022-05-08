namespace Irudd.When.Api.Storage;

public class StoredEvent
{
    public long SerializedModelVersion { get; set; }
    public string EventId { get; set; } = null!;
    public long DeleteAfterEpoch { get; set; }
    public string SerializedModel { get; set; } = null!;
}