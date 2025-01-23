import IcalEvent from "./IcalEvent.js";

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
        console.log("time!");
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

function getSchema(): Promise<IcalEvent[]>{
    return new Promise((resolve, reject) => {
        const schema: IcalEvent[] = [];
        
        fetch('/test.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse the response as JSON
            return response.json(); 
        })
        .then(data => {
            for(let event of data){
                schema.push(event);
            }
            resolve(schema);
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
            reject(error);
        });
    });
}

async function createSchema(){
    const schema = await getSchema();

    const event_template: HTMLTemplateElement = document.getElementById("event_card") as HTMLTemplateElement;
    const day_template: HTMLTemplateElement = document.getElementById("day_card") as HTMLTemplateElement;

    while(schema.length != 0){
        const day: IcalEvent[] = [];
        day.push(schema[0]);

        // Group events on the same day into array "day"
        for(let i = 1; i < schema.length; i++){
            if(schema[i].startDate === schema[0].startDate){
                day.push(schema[i]);
                schema.splice(i, 1);
            }
        }

        const day_clone = day_template.content.cloneNode(true) as DocumentFragment;
        const events = day_clone.querySelector("#events");

        // FULT
        let formattedDate: string = schema[0].startDate.slice(0, 4)+"-"+schema[0].startDate.slice(4, 6)+"-"+schema[0].startDate.slice(6);

        day_clone.querySelector("#date")!.textContent = formattedDate+" "+getDay(schema[0].startDate);

        // Behövs ens denna if?
        if(day.length > 1){
            // If several events on the same day
            for(let event2 of day){
                const tclone = event_template.content.cloneNode(true) as DocumentFragment;
                
                // FULT
                tclone.querySelector("#time")!.textContent = formatTime(zuluToCET(event2.startTime))+" - "+formatTime(zuluToCET(event2.endTime));
                tclone.querySelector("#kurs")!.textContent = event2.kurs;
                tclone.querySelector("#moment")!.textContent = event2.moment;
                tclone.querySelector("#location")!.textContent = event2.location;
    
                //const seperator = document.createElement("div");
                //seperator.className = "border-t border-gray-300 my-2";

                events!.appendChild(tclone);
                //events!.appendChild(seperator);
            }
        }else{
            // If only one event on the day
            const tclone = event_template.content.cloneNode(true) as DocumentFragment;
                
            tclone.querySelector("#time")!.textContent = formatTime(zuluToCET(schema[0].startTime))+" - "+formatTime(zuluToCET(schema[0].endTime));
            tclone.querySelector("#kurs")!.textContent = schema[0].kurs;
            tclone.querySelector("#moment")!.textContent = schema[0].moment;
            tclone.querySelector("#location")!.textContent = schema[0].location;
    
            events!.appendChild(tclone);
        }

        document.body.querySelector("#schema")!.appendChild(day_clone);

        schema.splice(0, 1);
    }
}