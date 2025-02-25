export default class IcalEvent{
    startDate: string;  
    endDate: string;
    startTime: string;
    endTime: string;
    week: string;
    location: string;
    program: string;
    kurs: string;
    moment: string;

    // https://en.wikipedia.org/wiki/ISO_week_date
    private calcWeekNumber(date: string):string{
        let month: number = parseInt(date.slice(4, 6));
        let day: number = parseInt(date.slice(6));

        let offset: number;

        //console.log("month: "+month);
        switch(month){
            case 1:
                offset = 0;
                break;
            case 2:
                offset = 31;
                break;
            case 3:
                offset = 59;
                break;
            case 4:
                offset = 90;
                break;
            case 5:
                offset = 120;
                break;
            case 6:
                offset = 151;
                break;
            case 7:
                offset = 181;
                break;
            case 8:
                offset = 212;
                break;
            case 9:
                offset = 243;
                break;
            case 10:
                offset = 273;
                break;
            case 11:
                offset = 304;
                break;
            case 12:
                offset = 334;
                break;
            default:
                //console.log("default offset");
                offset= 1000;
                break;
        }

        let dayOfYear: number = offset+day;

        let yearInt: number = parseInt(date.slice(0, 4));
        // Months are 0-indexed
        let monthInt: number = parseInt(date.slice(4, 6))-1;
        let dayInt: number = parseInt(date.slice(6));

        const date2 = new Date(yearInt, monthInt, dayInt);

        //console.log("date2: "+date2);
        
        let currentDay = date2.getDay();
        //console.log("curretnDay: "+currentDay)

        let dayOfWeek: number;

        switch(currentDay){
            case 0:
                // Söndag
                dayOfWeek = 7;
                break;
            case 1:
                // Måndag
                dayOfWeek = 1;
                break;
            case 2:
                // Tisdag
                dayOfWeek = 2;
                break;
            case 3:
                // Onsdag
                dayOfWeek = 3;
                break;
            case 4:
                // Torsdag
                dayOfWeek = 4;
                break;
            case 5:
                // Fredag
                dayOfWeek = 5;
                break;
            case 6:
                // Lördag
                dayOfWeek = 6;
                break;
            default:
                //console.log("default dayofweek");
                dayOfWeek = 1000;
                break;
        }

        //console.log("doy: "+dayOfYear);
        //console.log("dow: "+dayOfWeek);
        let weekOfYear = Math.floor((10 + dayOfYear - dayOfWeek)/7);

        //console.log("!!!!");

        //console.log(month);
        //console.log(day);
        //console.log(weekOfYear);
        //console.log("-----------");
        
        return weekOfYear.toString()
    }

    constructor(startDate: string, endDate: string, startTime: string, endTime: string, location: string, program: string, kurs: string, moment: string){
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.week = this.calcWeekNumber(startDate);
        this.location = location;
        this.program = program;
        this.kurs = kurs;
        this.moment = moment;
    }
}