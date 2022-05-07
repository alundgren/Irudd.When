using Microsoft.AspNetCore.SignalR;

namespace Irudd.When.Api.Hubs;

public class EventsHub : Hub
{
    public static async Task SendEventUpdate(IHubContext<EventsHub> context, string senderConnectionId, string eventId, ParticipantDateChoice choice)
    {
        await context.Clients.GroupExcept(GetGroupName(eventId), senderConnectionId).SendAsync("EventUpdate", new
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
    
    public async Task SetParticipantDateChoice(string eventId, ParticipantDateChoice participantDateChoice)
    {
        await Clients.GroupExcept(GetGroupName(eventId), Context.ConnectionId).SendAsync("EventUpdate", new
        {
            name = "participantDateChoice",
            payload = new
            {
                eventId = eventId,
                participantDateChoice = new
                {
                    dateId = participantDateChoice.DateId,
                    participantId = participantDateChoice.ParticipantId,
                    choice = participantDateChoice.Choice
                }
            }
        });
    }

    private static string GetGroupName(string eventId) => $@"EventUpdates_{eventId}";
}