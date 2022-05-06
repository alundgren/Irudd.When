using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;

namespace Irudd.When.Api.Methods
{
    public class SetParticipantDateChoiceMethod
    {
        internal static void Map(WebApplication app, KeyValueStore store, IHubContext<SetParticipantDateChoiceHub> hubContext)
        {
            app.MapPost("/api/v1/set-participant-date-choice", async ([FromBody] SetParticipantDateChoiceRequest request) =>
            {
                var evt = await store.GetEvent(request.EventId);
                if(evt == null)
                    return Results.NotFound();

                evt.participantDateChoices.Add(request.Choice);

                await store.SetEvent(evt);

                //TODO: Only send to clients that actually have this event open
                await hubContext.Clients.All.SendAsync("SetParticipantDateChoice", request.EventId, request.Choice);

                return Results.Ok();
            })
            .WithName("SetParticipantDateChoice");
        }
    }

    public record SetParticipantDateChoiceRequest(string EventId, ParticipantDateChoice Choice);

    public class SetParticipantDateChoiceHub : Hub
    {
        //TODO: Why do I need this when the exact same is repeated in the Map method? What does this do?
        public async Task SetParticipantDateChoice(string eventId, ParticipantDateChoice choice)
        {
            //TODO: Change all for just users connected to this event
            await Clients.All.SendAsync("SetParticipantDateChoice", eventId, choice);
        }
    }
}
