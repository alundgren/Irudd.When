using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.SignalR;

namespace Irudd.When.Api.Hubs;

public class EventsHub : Hub
{
    private readonly EventStore _store;

    public EventsHub(EventStore store)
    {
        _store = store;
    }
    
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
        var evt = await _store.GetEvent(eventId);
        if (evt == null)
            return;
        evt.ParticipantDateChoices.Add(participantDateChoice);
        await _store.SetEvent(evt);
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