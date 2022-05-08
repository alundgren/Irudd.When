using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Irudd.When.Api.Controllers;

public class ExistingEventController : Controller
{
    private readonly EventStoreOperation _storeOperation;

    public ExistingEventController(EventStoreOperation storeOperation)
    {
        _storeOperation = storeOperation;
    }
    
    [HttpGet("/api/v1/event/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ExistingEvent))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(string id)
    {
        var evt = await _storeOperation.GetEvent(id);
        return evt != null 
            ? Ok(evt) 
            : NotFound();
    }
}