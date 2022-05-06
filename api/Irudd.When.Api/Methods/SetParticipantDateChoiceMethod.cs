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
            app.MapPost("/api/v1/set-participant-date-choice", async (string eventId, ParticipantDateChoice choice) =>
            {
                var evt = await store.GetEvent(eventId);
                if(evt == null)
                    return Results.NotFound();

                evt.participantDateChoices.Add(choice);

                await store.SetEvent(evt);

                //TODO: Only send to clients that actually have this event open
                
                return Results.Ok();
            })
            .WithName("SetParticipantDateChoice");
        }
    }

    public class SetParticipantDateChoiceHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
