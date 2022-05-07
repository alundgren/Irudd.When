using System.Collections.Concurrent;

namespace Irudd.When.Api.Storage
{
    public class EventStore
    {
        private readonly IKeyValueStore _keyValueStore;

        public EventStore(IKeyValueStore keyValueStore)
        {
            _keyValueStore = keyValueStore;
        }

        public EventStore() : this(new InMemoryKeyValueStore())
        {
            
        }

        public async Task SetEvent(ExistingEvent evt)
        {
            await Task.Delay(50);
            await _keyValueStore.Set(evt.Id, evt);
        }

        public async Task<ExistingEvent?> GetEvent(string eventId)
        {
            await Task.Delay(50);
            return await _keyValueStore.Get<ExistingEvent>(eventId);
        }
        
        public void AddTestData() =>
            Task.Run(() =>
                SetEvent(new ExistingEvent(
                    "A424224",
                    "En lunch",
                    true,
                    new List<EventParticipant>
                    {
                        new ("p1", "Kalle"),
                        new ("p2", "Hobbe")
                    },
                    new List<EventDate>
                    {
                        new ("d1", "2022-12-21"),
                        new ("d2", "2022-12-22")
                    },
                    new List<ParticipantDateChoice>())));
    }
}
