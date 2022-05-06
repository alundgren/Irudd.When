import { DateTime } from 'luxon'

type DateFormat = 'full' | 'timeOnly' | 'dateOnly';

export class DateService {
    constructor(private locale: string, private dateOnly: boolean) {
        this.formatDateForEdit = this.formatDateForEdit.bind(this);
        this.getDateFormat = this.getDateFormat.bind(this);
        this.isValid = this.isValid.bind(this);
        this.formatForDisplay = this.formatForDisplay.bind(this);
    }

    getDateFormat(formatName: DateFormat) {
        if(formatName === 'full')
            return this.dateOnly ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm';
        else if(formatName === 'dateOnly')
            return 'yyyy-MM-dd';
        else if(formatName === 'timeOnly') {
            if(this.dateOnly) {
                throw new Error('time format cannot be used when dateOnly = true')
            }
            return 'HH:mm';
        } else {
            throw new Error('Not implemented');
        }
    }

    normalizeEventDate(date: DateTime) {
        return this.dateOnly 
            ? date.startOf('day')
            : date.startOf('minute');
    }

    formatDateForEdit(date: DateTime) {
        return date.setLocale(this.locale).toFormat(this.getDateFormat('full'));
    }

    formatForDisplay(date: DateTime | string, formatName: 'full' | 'timeOnly' | 'dateOnly') {
        let d = this.parse(date);
        return d.setLocale(this.locale).toFormat(this.getDateFormat(formatName));
    }

    isValid(date: string) {
        let result = this.tryParse(date);
        return result !== null;
    }

    tryParse(date: string) : DateTime | null {        
        let result = DateTime.fromFormat(date, this.getDateFormat('full'), { locale: this.locale });
        return result.isValid ? result : null;
    }

    parse(date: string | DateTime) : DateTime {
        if(typeof(date) !== 'string') {
            return date;
        }
        let result = this.tryParse(date);
        if(result === null) {
            throw new Error('Invalid date');
        }
        return result;
    }
}