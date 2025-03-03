import {renderHTML, renderBody, renderSchema, renderDay, renderEvent, renderWeek} from './htmlRenderer.js'
import IcalEvent from "./IcalEvent.js";
const fs = require('node:fs');

function formatTime(time: string):string{
    let formattedTime: string = time.slice(0, 2) + ":" + time.slice(2);

    return formattedTime;
}

function isSummerTime(dateString: string):boolean{
    // Parse current date
    let year = dateString.slice(0, 4);
    let month = dateString.slice(4, 6);
    let day = dateString.slice(6);

    let yearInt = parseInt(year);
    // Months are 0-indexed
    let monthInt = parseInt(month)-1;
    let dayInt = parseInt(day);

    const currentDate = new Date(yearInt, monthInt, dayInt);

    // Get last sunday of march
    const lastOfMarch = new Date(yearInt, 2, 31);

    const lastOfMarchDay = lastOfMarch.getDay();

    let marchOffset!: number;

    switch(lastOfMarchDay){
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

    const lastSundayOfMarch = new Date(yearInt, 2, 31-marchOffset);

    // Get last sunday of october
    const lastOfOctober = new Date(yearInt, 9, 31);
    
    const lastOfOctoberDay = lastOfOctober.getDay();

    let octoberOffset!: number;

    switch(lastOfOctoberDay){
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

    const lastSundayOfOctober = new Date(yearInt, 9, 31-octoberOffset);

    if((currentDate.getTime() >= lastSundayOfMarch.getTime()) && (currentDate.getTime() <= lastSundayOfOctober.getTime())){
        return true;
    }else{
        return false;
    }
}

function zuluToCET(timeString: string, isSummerTime: boolean):string{
    let newTime: string = "N/A";

    if(timeString.startsWith("23")){
        newTime = "00"+timeString.slice(2);

        return newTime;
    }

    let time: number = parseInt(timeString);

    if(isSummerTime){
        time += 200;
    }else{
        time += 100;
    }

    newTime = time.toString();

    if(time < 1000){
        newTime = "0"+newTime;
        return newTime
    }else{
        return newTime
    }
}

function getDay(dateString: string):string{
    let year = dateString.slice(0, 4);
    let month = dateString.slice(4, 6);
    let day = dateString.slice(6);

    let yearInt = parseInt(year);
    // Months are 0-indexed
    let monthInt = parseInt(month)-1;
    let dayInt = parseInt(day);

    const date = new Date(yearInt, monthInt, dayInt);
    
    let currentDay = date.getDay();

    switch(currentDay){
        case 0:
            return "Söndag"
        case 1:
            return "Måndag"
        case 2:
            return "Tisdag"
        case 3:
            return "Onsdag"
        case 4:
            return "Torsdag"
        case 5:
            return "Fredag"
        case 6:
            return "Lördag"
        default:
            return "N/A"
    }
}

function groupByDay(IcalArr: IcalEvent[], startDate: string):IcalEvent[]{
    const dayGroup: IcalEvent[] = IcalArr.filter(event => event.startDate === startDate);

    return dayGroup;
}


function groupByWeek(IcalArr: IcalEvent[], week: string):IcalEvent[]{
    const weekGroup: IcalEvent[] = IcalArr.filter(event => event.week === week);
    
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

function createHtmlFile(IcalArr: IcalEvent[]):string{
    const schema: string[] = [];

    while(IcalArr.length > 0){
        let currentEvent: IcalEvent = IcalArr[0];
        let week = groupByWeek(IcalArr, currentEvent.week);

        let weekNumber = week[0].week;
        let eventsOfTheWeek: string[] = [];

        // Remove elements from original array
        IcalArr = IcalArr.filter(event => !week.includes(event));

        while(week.length > 0){
            let currentEvent2: IcalEvent = week[0];
            const day: IcalEvent[] = groupByDay(week, currentEvent2.startDate);

            // Remove elements from week array
            week = week.filter(dayEvent => !day.includes(dayEvent));

            const eventsOfTheDay: string[] = [];
            
            // FULT
            let formattedDate: string = day[0].startDate.slice(0, 4)+"-"+day[0].startDate.slice(4, 6)+"-"+day[0].startDate.slice(6);
            const date = formattedDate+" "+getDay(day[0].startDate);

            // Render events
            for(let event3 of day){
                // FULT
                const eventHtml = renderEvent(formatTime(zuluToCET(event3.startTime, isSummerTime(event3.startDate)))+" - "+formatTime(zuluToCET(event3.endTime, isSummerTime(event3.startDate))), event3.kurs, event3.moment, event3.location)
                eventsOfTheDay.push(eventHtml);
            }

            const dayHtml = renderDay(eventsOfTheDay, date);

            eventsOfTheWeek.push(dayHtml);
        }

        const weekHtml = renderWeek(eventsOfTheWeek, weekNumber);

        schema.push(weekHtml);
    }
    
    const renderedSchema: string = renderSchema(schema);
    const renderedBody: string = renderBody(renderedSchema);
    const renderedHTML: string = renderHTML(renderedBody);

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
    createHtmlFile,
  };