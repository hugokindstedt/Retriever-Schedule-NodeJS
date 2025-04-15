"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var htmlRenderer_js_1 = require("./htmlRenderer.js");
var fs = require('node:fs');
function formatTime(time) {
    var formattedTime = time.slice(0, 2) + ":" + time.slice(2);
    return formattedTime;
}
function isSummerTime(dateString) {
    // Parse current date
    var year = dateString.slice(0, 4);
    var month = dateString.slice(4, 6);
    var day = dateString.slice(6);
    var yearInt = parseInt(year);
    // Months are 0-indexed
    var monthInt = parseInt(month) - 1;
    var dayInt = parseInt(day);
    var currentDate = new Date(yearInt, monthInt, dayInt);
    // Get last sunday of march
    var lastOfMarch = new Date(yearInt, 2, 31);
    var lastOfMarchDay = lastOfMarch.getDay();
    var marchOffset;
    switch (lastOfMarchDay) {
        case 0:
            marchOffset = 0;
            break;
        case 1:
            marchOffset = 1;
            break;
        case 2:
            marchOffset = 2;
            break;
        case 3:
            marchOffset = 3;
            break;
        case 4:
            marchOffset = 4;
            break;
        case 5:
            marchOffset = 5;
            break;
        case 6:
            marchOffset = 6;
    }
    var lastSundayOfMarch = new Date(yearInt, 2, 31 - marchOffset);
    // Get last sunday of october
    var lastOfOctober = new Date(yearInt, 9, 31);
    var lastOfOctoberDay = lastOfOctober.getDay();
    var octoberOffset;
    switch (lastOfOctoberDay) {
        case 0:
            octoberOffset = 0;
            break;
        case 1:
            octoberOffset = 1;
            break;
        case 2:
            octoberOffset = 2;
            break;
        case 3:
            octoberOffset = 3;
            break;
        case 4:
            octoberOffset = 4;
            break;
        case 5:
            octoberOffset = 5;
            break;
        case 6:
            octoberOffset = 6;
    }
    var lastSundayOfOctober = new Date(yearInt, 9, 31 - octoberOffset);
    if ((currentDate.getTime() >= lastSundayOfMarch.getTime()) && (currentDate.getTime() <= lastSundayOfOctober.getTime())) {
        return true;
    }
    else {
        return false;
    }
}
function zuluToCET(timeString, isSummerTime) {
    var newTime = "N/A";
    if (timeString.startsWith("23")) {
        newTime = "00" + timeString.slice(2);
        return newTime;
    }
    var time = parseInt(timeString);
    if (isSummerTime) {
        time += 200;
    }
    else {
        time += 100;
    }
    newTime = time.toString();
    if (time < 1000) {
        newTime = "0" + newTime;
        return newTime;
    }
    else {
        return newTime;
    }
}
function getDay(dateString) {
    var year = dateString.slice(0, 4);
    var month = dateString.slice(4, 6);
    var day = dateString.slice(6);
    var yearInt = parseInt(year);
    // Months are 0-indexed
    var monthInt = parseInt(month) - 1;
    var dayInt = parseInt(day);
    var date = new Date(yearInt, monthInt, dayInt);
    var currentDay = date.getDay();
    switch (currentDay) {
        case 0:
            return "Söndag";
        case 1:
            return "Måndag";
        case 2:
            return "Tisdag";
        case 3:
            return "Onsdag";
        case 4:
            return "Torsdag";
        case 5:
            return "Fredag";
        case 6:
            return "Lördag";
        default:
            return "N/A";
    }
}
function groupByDay(IcalArr, startDate) {
    var dayGroup = IcalArr.filter(function (event) { return event.startDate === startDate; });
    return dayGroup;
}
function groupByWeek(IcalArr, week) {
    var weekGroup = IcalArr.filter(function (event) { return event.week === week; });
    return weekGroup;
}
/*
function createHtmlFile(IcalArr: IcalEvent[]):string{
    const weeks = new Map<string, Map<string, IcalEvent[]>>();

    for(let event of IcalArr){
        // Create KEY:VALUE pair if it doesnt exist for that week
        if(!weeks.has(event.week)){
            weeks.set(event.week, []);
        }

        // Add event to week value array
        weeks.get(event.week)!.push(event);
    }



    for(const pair of weeks.entries()){
        const weekNumber: string = pair[0];
        const events: IcalEvent[] = pair[1];


    }

}
*/
function createHtmlFile(IcalArr) {
    var schema = [];
    var _loop_1 = function () {
        var currentEvent = IcalArr[0];
        var week = groupByWeek(IcalArr, currentEvent.week);
        var weekNumber = week[0].week;
        var eventsOfTheWeek = [];
        // Remove elements from original array
        IcalArr = IcalArr.filter(function (event) { return !week.includes(event); });
        var _loop_2 = function () {
            var e_1, _a;
            var currentEvent2 = week[0];
            var day = groupByDay(week, currentEvent2.startDate);
            // Remove elements from week array
            week = week.filter(function (dayEvent) { return !day.includes(dayEvent); });
            var eventsOfTheDay = [];
            // FULT
            var formattedDate = day[0].startDate.slice(0, 4) + "-" + day[0].startDate.slice(4, 6) + "-" + day[0].startDate.slice(6);
            var date = formattedDate + " " + getDay(day[0].startDate);
            try {
                // Render events
                for (var day_1 = (e_1 = void 0, __values(day)), day_1_1 = day_1.next(); !day_1_1.done; day_1_1 = day_1.next()) {
                    var event3 = day_1_1.value;
                    // FULT
                    var eventHtml = void 0;
                    if (event3.moment.includes("tenta")) {
                        eventHtml = (0, htmlRenderer_js_1.renderTentaEvent)(formatTime(zuluToCET(event3.startTime, isSummerTime(event3.startDate))) + " - " + formatTime(zuluToCET(event3.endTime, isSummerTime(event3.startDate))), event3.kurs, event3.moment, event3.location, event3.sign);
                    }
                    else {
                        eventHtml = (0, htmlRenderer_js_1.renderEvent)(formatTime(zuluToCET(event3.startTime, isSummerTime(event3.startDate))) + " - " + formatTime(zuluToCET(event3.endTime, isSummerTime(event3.startDate))), event3.kurs, event3.moment, event3.location, event3.sign);
                    }
                    eventsOfTheDay.push(eventHtml);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (day_1_1 && !day_1_1.done && (_a = day_1["return"])) _a.call(day_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var dayHtml = (0, htmlRenderer_js_1.renderDay)(eventsOfTheDay, date);
            eventsOfTheWeek.push(dayHtml);
        };
        while (week.length > 0) {
            _loop_2();
        }
        var weekHtml = (0, htmlRenderer_js_1.renderWeek)(eventsOfTheWeek, weekNumber);
        schema.push(weekHtml);
    };
    while (IcalArr.length > 0) {
        _loop_1();
    }
    var renderedSchema = (0, htmlRenderer_js_1.renderSchema)(schema);
    var renderedBody = (0, htmlRenderer_js_1.renderBody)(renderedSchema);
    var renderedHTML = (0, htmlRenderer_js_1.renderHTML)(renderedBody);
    return renderedHTML;
}
/*
function createHtmlFile(IcalEventFile: IcalEvent[]):string{
    const schema: string[] = [];
    let run: number = 0;

    // Gör om så vi använder array.filter istället (tror den hette så)
    while(IcalEventFile.length != 0){
        run++;
        const day: IcalEvent[] = [];
        day.push(IcalEventFile[0]);

        // Group events on the same day into array "day"
        for(let i = 1; i < IcalEventFile.length; i++){
            if(IcalEventFile[i].startDate === IcalEventFile[0].startDate){
                day.push(IcalEventFile[i]);
                IcalEventFile.splice(i, 1);
                i--;
            }
        }

        const events: string[] = [];

        // FULT
        let formattedDate: string = IcalEventFile[0].startDate.slice(0, 4)+"-"+IcalEventFile[0].startDate.slice(4, 6)+"-"+IcalEventFile[0].startDate.slice(6);

        const date = formattedDate+" "+getDay(IcalEventFile[0].startDate);

        // Behövs ens denna if?
        if(day.length > 1){
            // If several events on the same day
            for(let event2 of day){
                console.log("week: "+event2.week);

                // Döp om "tclone"
                const tclone = renderEvent(formatTime(zuluToCET(event2.startTime))+" - "+formatTime(zuluToCET(event2.endTime)), event2.kurs, event2.moment, event2.location)

                events.push(tclone);
            }
        }else{
            console.log("week: "+IcalEventFile[0].week);

            // If only one event on the day
            const tclone = renderEvent(formatTime(zuluToCET(IcalEventFile[0].startTime))+" - "+formatTime(zuluToCET(IcalEventFile[0].endTime)), IcalEventFile[0].kurs, IcalEventFile[0].moment, IcalEventFile[0].location);
    
            events.push(tclone);
        }

        const eventsTopush = renderDay(events, date);

        schema.push(eventsTopush);

        IcalEventFile.splice(0, 1);
    }

    const renderedSchema: string = renderSchema(schema);
    const renderedBody: string = renderBody(renderedSchema);
    const renderedHTML: string = renderHTML(renderedBody);

    return renderedHTML;
}
*/
module.exports = {
    createHtmlFile: createHtmlFile
};
