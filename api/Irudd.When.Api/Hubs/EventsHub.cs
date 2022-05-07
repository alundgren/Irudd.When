using Irudd.When.Api.Methods;
using Microsoft.AspNetCore.SignalR;

namespace Irudd.When.Api.Hubs;

public class EventsHub : Hub
{
    public static async Task SendEventUpdate(IHubContext<EventsHub> context, string eventId, ParticipantDateChoice choice)
    {
        await context.Clients.Group(GetGroupName(eventId)).SendAsync("EventUpdate", new
        {
            name = "participantDateChoice",
            payload = new
            {
                eventId = eventId,
                participantDateChoice = new
                {
                    dateId = choice.DateId,
                    participantId = choice.ParticipantId,
                    choice = choice.Choice
                }
            }
        });
    }

    public async Task SubscribeToEventUpdates(string eventId)
    {
        if(!string.IsNullOrWhiteSpace(eventId))
            await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(eventId));
    }

    private static string GetGroupName(string eventId) => $@"EventUpdates_{eventId}";
}