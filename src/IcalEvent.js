"use strict";
exports.__esModule = true;
var IcalEvent = /** @class */ (function () {
    function IcalEvent(startDate, endDate, startTime, endTime, location, program, kurs, sign, moment) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.week = this.calcWeekNumber(startDate);
        this.location = location;
        this.program = program;
        this.kurs = kurs;
        this.sign = sign;
        this.moment = moment;
    }
    // https://en.wikipedia.org/wiki/ISO_week_date
    IcalEvent.prototype.calcWeekNumber = function (date) {
        var month = parseInt(date.slice(4, 6));
        var day = parseInt(date.slice(6));
        var offset;
        //console.log("month: "+month);
        switch (month) {
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
                offset = 1000;
                break;
        }
        var dayOfYear = offset + day;
        var yearInt = parseInt(date.slice(0, 4));
        // Months are 0-indexed
        var monthInt = parseInt(date.slice(4, 6)) - 1;
        var dayInt = parseInt(date.slice(6));
        var date2 = new Date(yearInt, monthInt, dayInt);
        //console.log("date2: "+date2);
        var currentDay = date2.getDay();
        //console.log("curretnDay: "+currentDay)
        var dayOfWeek;
        switch (currentDay) {
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
        var weekOfYear = Math.floor((10 + dayOfYear - dayOfWeek) / 7);
        //console.log("!!!!");
        //console.log(month);
        //console.log(day);
        //console.log(weekOfYear);
        //console.log("-----------");
        return weekOfYear.toString();
    };
    return IcalEvent;
}());
exports["default"] = IcalEvent;
