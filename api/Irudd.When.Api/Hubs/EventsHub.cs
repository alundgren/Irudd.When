using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;
using System.Security.Cryptography;

namespace Irudd.When.Api.Hubs;

[SignalRHub]
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

    public async Task<ExistingEvent> CreateEvent(NewEvent newEvent)
    {
        var id = CreateRandomUrlSafeString(7);
        var evt = new ExistingEvent(
            id,
            newEvent.Description,
            newEvent.DateOnly,
            newEvent.Participants,
            newEvent.Dates,
            new List<ParticipantDateChoice>());

        await _store.SetEvent(evt);

        return evt;
    }

    public async Task<ExistingEvent?> GetEvent(string id)
    {
        var evt = await _store.GetEvent(id);
        return evt;
    }

    private static string CreateRandomUrlSafeString(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[RandomNumberGenerator.GetInt32(s.Length)]).ToArray());
    }

    private static string GetGroupName(string eventId) => $@"EventUpdates_{eventId}";
}