using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Irudd.When.Api.Methods
{
    public class CreateEventMethod
    {
        internal static void Map(WebApplication app)
        {
            app.MapPost("/api/v1/create-event", ( [FromBody] NewEvent newEvent) =>
            {
                return new ExistingEvent(
                    "A424224",
                    "En lunch",
                    true,
                    new List<EventParticipant> 
                    {
                        new EventParticipant("p1", "Kalle"),
                        new EventParticipant("p2", "Hobbe")
                    },
                    new List<EventDate> 
                    { 
                        new EventDate("d1", "2022-12-21"),
                        new EventDate("d2", "2022-12-22")
                    });
            })
            .WithName("CreateEvent");
        }
    }
}
