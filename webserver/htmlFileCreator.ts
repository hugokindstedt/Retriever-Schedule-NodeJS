import { error } from 'console';
import {renderHTML, renderBody, renderSchema, renderDay, renderEvent} from './htmlRenderer.js'
import IcalEvent from "./IcalEvent.js";
const fs = require('node:fs');

function formatTime(time: string):string{
    let formattedTime: string = time.slice(0, 2) + ":" + time.slice(2);

    return formattedTime;
}

function zuluToCET(timeString: string):string{
    let newTime: string = "N/A";

    if(timeString.startsWith("23")){
        newTime = "00"+timeString.slice(2);

        return newTime;
    }

    let time: number = parseInt(timeString);

    time += 100;

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

        /*for(let x of day){
            console.log("run: "+run+" "+x.kurs);
        }*/

        const events: string[] = [];

        // FULT
        let formattedDate: string = IcalEventFile[0].startDate.slice(0, 4)+"-"+IcalEventFile[0].startDate.slice(4, 6)+"-"+IcalEventFile[0].startDate.slice(6);

        const date = formattedDate+" "+getDay(IcalEventFile[0].startDate);

        // Behövs ens denna if?
        if(day.length > 1){
            // If several events on the same day
            for(let event2 of day){
                // Döp om "tclone"
                const tclone = renderEvent(formatTime(zuluToCET(event2.startTime))+" - "+formatTime(zuluToCET(event2.endTime)), event2.kurs, event2.moment, event2.location)

                events.push(tclone);
            }
        }else{
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

    /*
    fs.writeFile(filePath, renderedHTML, (err: NodeJS.ErrnoException | null) => {
        if(err){
            console.error(err);
        }
    });
    */

    return renderedHTML;
}

module.exports = {
    createHtmlFile,
  };