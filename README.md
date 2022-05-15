# Irudd.When
![image](https://user-images.githubusercontent.com/445243/168457577-3b434665-0eb3-4d60-92fd-962ab857e42b.png)

- Meeting scheduler app. Main focus is learning react.
- The "production" (ish) version is here: https://when.irudd.se/

## TODO
- Support english language and standard locale based date and time formats.
- Allow editing active events.
- Show a preview of the event while creting where choices can be prefilled.
- Clearer way of indicating winners/losers.
- Finetuning buttons for the time editor

## Deploy

Once:
>> npm install -g caprover
>> caprover login

Every time api:
>> .\deploy-api-prod.ps1

Every time ui:
>> .\deploy-ui-prod.ps1
