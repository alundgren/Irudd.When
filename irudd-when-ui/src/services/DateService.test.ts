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

test('isValid: 2022-12-24 23:45 is a valid date and time', () => {
    expect(dateAndTimeDateService.isValid('2022-12-24 23:45')).toBe(true);
});

test('isValid: 2022-12-24 23:45 is an invalid date only', () => {
    expect(dateOnlyDateService.isValid('2022-12-24 23:45')).toBe(false);
});

test('isValid: 2022-12-24 is a valid date only', () => {
    expect(dateOnlyDateService.isValid('2022-12-24')).toBe(true);
});

test('isValid: Empty string is not a valid date', () => {
    expect(dateOnlyDateService.isValid('')).toBe(false);
});

test('formatForDisplay: full format shows date and time', () => {
    let date = DateTime.local(2022, 12, 24, 23, 45, 58, 59);
    expect(dateAndTimeDateService.formatForDisplay(date, 'full')).toBe('2022-12-24 23:45')
});

test('formatForDisplay: dateOnly format shows date but no time', () => {
    let date = DateTime.local(2022, 12, 24, 23, 45, 58, 59);
    expect(dateAndTimeDateService.formatForDisplay(date, 'dateOnly')).toBe('2022-12-24')
});

test('formatForDisplay: timeOnly format shows time but no date', () => {
    let date = DateTime.local(2022, 12, 24, 23, 45, 58, 59);
    expect(dateAndTimeDateService.formatForDisplay(date, 'timeOnly')).toBe('23:45')
});