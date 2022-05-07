using Irudd.When.Api.Methods;
using System.Collections.Concurrent;

namespace Irudd.When.Api.Storage
{
    public class KeyValueStore
    {
        private static ConcurrentDictionary<string, ExistingEvent> storage = new ConcurrentDictionary<string, ExistingEvent>();

        public async Task SetEvent(ExistingEvent evt)
        {
            await Task.Delay(50);
            storage[evt.Id] = evt;
        }

        public async Task<ExistingEvent?> GetEvent(string eventId)
        {
            await Task.Delay(50);
            return storage.TryGetValue(eventId, out var value) ? value : null;
        }
    }
}
