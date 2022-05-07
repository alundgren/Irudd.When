using System.Collections.Concurrent;

namespace Irudd.When.Api.Storage;

public class InMemoryKeyValueStore : IKeyValueStore
{
    private static readonly ConcurrentDictionary<string, object> Storage = new ();

    public Task Set<T>(string key, T? value) where T : class
    {
        if (value == null)
        {
            Storage.TryRemove(key, out _);
        }
        else
        {
            Storage[key] = value;    
        }
        return Task.CompletedTask;
    }

    public Task<T?> Get<T>(string key) where T : class
    {
        return Task.FromResult(Storage.TryGetValue(key, out var value) 
            ? value as T 
            : null);
    }
}