using System.Collections.Concurrent;

namespace Irudd.When.Api.Storage
{
    public class KeyValueStore
    {
        private static readonly ConcurrentDictionary<string, ExistingEvent> Storage = new ();

        public async Task SetEvent(ExistingEvent evt)
        {
            await Task.Delay(50);
            Storage[evt.Id] = evt;
        }

        public async Task<ExistingEvent?> GetEvent(string eventId)
        {
            await Task.Delay(50);
            return Storage.TryGetValue(eventId, out var value) ? value : null;
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
