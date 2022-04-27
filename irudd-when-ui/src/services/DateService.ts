import { DateTime } from 'luxon'

export class DateService {
    constructor(private locale: string, private dateOnly: boolean) {
        this.formatDateForEdit = this.formatDateForEdit.bind(this);
    }

    normalizeEventDate(date: DateTime) {
        return this.dateOnly 
            ? date.startOf('day')
            : date.startOf('minute');
    }

    formatDateForEdit(date: DateTime) {
        return date.setLocale(this.locale).toLocaleString(this.dateOnly ? DateTime.DATE_SHORT : DateTime.DATETIME_SHORT);
    }
}