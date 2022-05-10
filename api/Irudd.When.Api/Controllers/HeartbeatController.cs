using System.Security.Cryptography;
using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Irudd.When.Api.Controllers
{
    public class HeartbeatController : Controller
    {
        [HttpGet("hb")]
        public IActionResult Get()
        {
            return Ok(new { Date = DateTime.UtcNow.ToString("o") });
        }
    }
}
