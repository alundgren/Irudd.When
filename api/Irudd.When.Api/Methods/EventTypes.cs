namespace Irudd.When.Api.Methods
{
    public record NewEvent(
        string Description,
        bool DateOnly,
        List<EventParticipant> Participants,
        List<EventDate> EventDates);

    public record ExistingEvent(
        string Id,
        string Description,
        bool DateOnly,
        List<EventParticipant> Participants,
        List<EventDate> EventDates,
        List<ParticipantDateChoice> participantDateChoices);

    public record EventParticipant(string Id, string Name);
    public record EventDate(string Id, string Date);

    public record ParticipantDateChoice(
        string DateId,
        string ParticipantId,
        string Choice);
}
