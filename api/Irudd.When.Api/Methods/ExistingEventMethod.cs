using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Irudd.When.Api.Methods
{
    public class ExistingEventMethod
    {
        internal static void Map(WebApplication app, KeyValueStore store)
        {
            app.MapGet("/api/v1/event/{id}", async (string id) =>
            {
                var evt = await store.GetEvent(id);
                if (evt != null)
                    return Results.Ok(evt);
                else
                    return Results.NotFound();   
            })
            .WithName("ExistingEvent");
        }
    }
}
