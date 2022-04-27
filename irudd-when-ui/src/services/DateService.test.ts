import { DateTime } from "luxon";
import { DateService } from "./DateService";

const dateOnlyDateService = new DateService('sv-SE', true);
const dateAndTimeDateService =  new DateService('sv-SE', false);

test('formatDateForEdit: Swedish date only edit format is YYYY-MM-DD', () => {
    let date = DateTime.local(2022, 12, 24, 23, 45, 58, 59);
    expect(dateOnlyDateService.formatDateForEdit(date)).toBe('2022-12-24');
});

test('formatDateForEdit: Swedish date and time edit format is YYYY-MM-DD HH:mm', () => {
    let date = DateTime.local(2022, 12, 24, 23, 45, 58, 59);
    expect(dateAndTimeDateService.formatDateForEdit(date)).toBe('2022-12-24 23:45');
});