namespace Irudd.When.Api.Storage;

public interface IKeyValueStore
{
    public Task Set<T>(string key, T value) where T : class;
    public Task<T?> Get<T>(string key) where T : class;
}