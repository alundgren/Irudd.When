using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Irudd.When.Api.Controllers;

public class ExistingEventController : Controller
{
    private readonly EventStore _store;

    public ExistingEventController(EventStore store)
    {
        _store = store;
    }
    
    [HttpGet("/api/v1/event/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ExistingEvent))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        var evt = await _store.GetEvent(id);
        return evt != null 
            ? Ok(evt) 
            : NotFound();
    }
}