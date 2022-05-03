using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Irudd.When.Api.Methods
{
    public class ExistingEventMethod
    {
        internal static void Map(WebApplication app)
        {
            app.MapGet("/api/v1/event/{id}", (string id) =>
            {
                if (id == "A424224")
                {
                    return Results.Ok(new ExistingEvent(
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
                        }));
                }
                else 
                    return Results.NotFound();
            })
            .WithName("ExistingEvent");
        }
    }
}
