using Irudd.When.Api.Hubs;
using Irudd.When.Api.Methods;
using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Irudd.When.Api.Controllers
{
    public class SetParticipantDateChoiceController : Controller
    {
        private readonly KeyValueStore _store;
        private readonly IHubContext<EventsHub> _eventsHubContext;

        public SetParticipantDateChoiceController(KeyValueStore store, IHubContext<EventsHub> eventsHubContext)
        {
            _store = store;
            _eventsHubContext = eventsHubContext;
        }
        
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]        
        [HttpPost("/api/v1/set-participant-date-choice")]
        public async Task<IActionResult> Post([FromBody] SetParticipantDateChoiceRequest request)
        {
            var evt = await _store.GetEvent(request.EventId);
            if(evt == null)
                return NotFound();

            evt.participantDateChoices.Add(request.Choice);

            await _store.SetEvent(evt);

            //TODO: Only send to clients that actually have this event open
            await EventsHub.SendEventUpdate(_eventsHubContext, request.EventId, request.Choice);
            
            return Ok();
        }
    }

    public record SetParticipantDateChoiceRequest(string EventId, ParticipantDateChoice Choice);
}
