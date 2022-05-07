﻿using System.Security.Cryptography;
using Irudd.When.Api.Methods;
using Irudd.When.Api.Storage;
using Microsoft.AspNetCore.Mvc;

namespace Irudd.When.Api.Controllers
{
    public class CreateEventController : Controller
    {
        private readonly KeyValueStore _store;

        public CreateEventController(KeyValueStore store)
        {
            _store = store;
        }

        [HttpPost("/api/v1/create-event")]
        public async Task<ExistingEvent> Post([FromBody] NewEvent newEvent)
        {
            var id = CreateRandomUrlSafeString(7);
            var evt = new ExistingEvent(
                id,
                newEvent.Description,
                newEvent.DateOnly,
                newEvent.Participants ?? new List<EventParticipant>(),
                new List<EventDate>() ?? new List<EventDate>(),
                new List<ParticipantDateChoice>());

            await _store.SetEvent(evt);

            return evt;
        }

        private static string CreateRandomUrlSafeString(int length)
        {            
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[RandomNumberGenerator.GetInt32(s.Length)]).ToArray());
        }

        //TODO: Move this
        public static void AddTestData(KeyValueStore store) =>
            Task.Run(() =>
                store.SetEvent(new ExistingEvent(
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
                    },
                    new List<ParticipantDateChoice>())));
    }
}