using System.Security.Cryptography;
using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Irudd.When.Api.Controllers
{
    public class CreateEventController : Controller
    {
        private readonly EventStoreOperation _storeOperation;

        public CreateEventController(EventStoreOperation storeOperation)
        {
            _storeOperation = storeOperation;
        }

        [HttpPost("/api/v1/create-event")]
        public async Task<ExistingEvent> Post([FromBody] NewEvent newEvent)
        {
            var id = CreateRandomUrlSafeString(7);
            var evt = new ExistingEvent(
                id,
                newEvent.Description,
                newEvent.DateOnly,
                newEvent.Participants,
                new List<EventDate>(),
                new List<ParticipantDateChoice>());

            await _storeOperation.SetEvent(evt);

            return evt;
        }

        private static string CreateRandomUrlSafeString(int length)
        {            
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[RandomNumberGenerator.GetInt32(s.Length)]).ToArray());
        }

        //TODO: Move this

    }
}
