import { DateTime } from 'luxon'

export class DateService {
    //TODO: Find out if good or bad to inject the store here.
    constructor(private locale: string, private dateOnly: boolean) {
        this.formatDateForEdit = this.formatDateForEdit.bind(this);
        this.getDateFormat = this.getDateFormat.bind(this);
        this.isValid = this.isValid.bind(this);
    }

    getDateFormat() {
        //TODO: Localize
        return this.dateOnly ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm';
    }

    normalizeEventDate(date: DateTime) {
        return this.dateOnly 
            ? date.startOf('day')
            : date.startOf('minute');
    }

    formatDateForEdit(date: DateTime) {
        return date.setLocale(this.locale).toFormat(this.getDateFormat());
    }

    isValid(date: string) {
        let result = this.tryParse(date);
        return result !== null;
    }

    tryParse(date: string) : DateTime | null {        
        let result = DateTime.fromFormat(date, this.getDateFormat(), { locale: this.locale });
        return result.isValid ? result : null;
    }

    parse(date: string) : DateTime {
        let result = this.tryParse(date);
        if(result === null) {
            throw new Error('Invalid date');
        }
        return result;
    }
}