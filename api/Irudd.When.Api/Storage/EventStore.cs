using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Irudd.When.Api.Storage
{
    public class EventStore
    {
        private readonly EventsContext _context;
        private const int CurrentModelVersion = 2022050801;
        
        public EventStore(EventsContext context)
        {
            _context = context;
        }

        public async Task SetEvent(ExistingEvent evt)
        {
            evt = NormalizeEvent(evt);
            
            var storedEvent = await _context.StoredEvents.SingleOrDefaultAsync(x => x.EventId == evt.Id);
            if (storedEvent == null)
            {
                _context.StoredEvents.Add(new StoredEvent
                {
                    EventId = evt.Id,
                    DeleteAfterEpoch = DateTimeOffset.UtcNow.AddDays(30).ToUnixTimeMilliseconds(),
                    SerializedModelVersion = CurrentModelVersion,
                    SerializedModel = JsonConvert.SerializeObject(evt)
                });
            }
            else
            {
                storedEvent.SerializedModel = JsonConvert.SerializeObject(evt);
                storedEvent.DeleteAfterEpoch = DateTimeOffset.UtcNow.AddDays(30).ToUnixTimeMilliseconds();
            }

            await _context.SaveChangesAsync();
        }

        public async Task<ExistingEvent?> GetEvent(string eventId)
        {
            var storedEvent = await _context.StoredEvents.SingleOrDefaultAsync(x => x.EventId == eventId);

            if (storedEvent == null)
                return null;

            var evt = JsonConvert.DeserializeObject<ExistingEvent>(storedEvent.SerializedModel);

            return evt == null ? null : NormalizeEvent(evt);
        }

        private ExistingEvent NormalizeEvent(ExistingEvent evt)
        {
            var trimmedChoices = evt
                .ParticipantDateChoices.Select((x, i) => new
                {
                    Item = x,
                    Index = i
                })
                .GroupBy(x => new {x.Item.DateId, x.Item.ParticipantId})
                .Select(x => x.OrderByDescending(y => y.Index).Select(y => y.Item).First())
                .ToList();

            return new ExistingEvent(evt.Id, evt.Description, evt.DateOnly, evt.Participants, evt.Dates,
                trimmedChoices);
        }

        public async Task AddTestData()
        {
            await SetEvent(new ExistingEvent(
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
                new List<ParticipantDateChoice>()));
        }
    }
}
