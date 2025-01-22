import IcalEvent from "./IcalEvent.js";


function getSchema(): Promise<IcalEvent[]>{
    return new Promise((resolve, reject) => {
        const schema: IcalEvent[] = [];
        
        fetch('/test.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            for(let event of data){
                schema.push(event);
            }
            resolve(schema);
        })
        .catch(error => {
            console.error('Error fetching the data:', error); // Log any errors
            reject(error);
        });
    });
}

async function templatetest(){
    const schema = await getSchema();
    const template: HTMLTemplateElement = document.getElementById("event_card") as HTMLTemplateElement;

    while(schema.length != 0){
        const day: IcalEvent[] = [];
        day.push(schema[0]);
        //console.log("Current: "+event.kurs+event.startDate);

        for(let i = 1; i < schema.length; i++){
            if(schema[i].startDate === schema[0].startDate){
                day.push(schema[i]);
                console.log("To splice: "+schema[i].kurs+schema[i].startDate);
                schema.splice(i, 1);
            }
        }

        const newDiv = document.createElement("div");
        const date = document.createElement("h2");
        newDiv.className = schema[0].startDate;
        date.textContent = schema[0].startDate;
        newDiv.appendChild(date);

        if(day.length > 1){
            // If several events on the same day
            for(let event2 of day){
                const tclone = template.content.cloneNode(true) as DocumentFragment;
                
                tclone.querySelector("#time")!.textContent = event2.startTime;
                tclone.querySelector("#kurs")!.textContent = event2.kurs;
                tclone.querySelector("#moment")!.textContent = event2.moment;
                tclone.querySelector("#location")!.textContent = event2.location;
    
                console.log("tclone: "+tclone.querySelector("#kurs")!.textContent);
    
                newDiv.appendChild(tclone);
            }
        }else{
            // If only one event on the day
            const tclone = template.content.cloneNode(true) as DocumentFragment;
                
            tclone.querySelector("#time")!.textContent = schema[0].startTime;
            tclone.querySelector("#kurs")!.textContent = schema[0].kurs;
            tclone.querySelector("#moment")!.textContent = schema[0].moment;
            tclone.querySelector("#location")!.textContent = schema[0].location;
    
            console.log("tclone: "+tclone.querySelector("#kurs")!.textContent);
    
            newDiv.appendChild(tclone);
        }

        document.body.appendChild(newDiv);
        schema.splice(0, 1);
    }
}

async function printtest(){
    const schema = await getSchema();
    
    for (let event of schema){
        const testdiv = document.createElement("div");
        testdiv.className = "testdiv";

        const startDate = document.createElement("p");
        const startTime = document.createElement("p");
        const endDate = document.createElement("p");
        const endTime = document.createElement("p");
        const location = document.createElement("p");
        const program = document.createElement("p");
        const kurs = document.createElement("p");
        const moment = document.createElement("p");

        startDate.innerText = event.startDate;
        startTime.innerText = event.startTime;
        endDate.innerText = event.endDate;
        endTime.innerText = event.endTime;
        location.innerText = event.location;
        program.innerText = event.program;
        kurs.innerText = event.kurs;
        moment.innerText = event.moment;

        testdiv.appendChild(startDate);
        testdiv.appendChild(startTime);
        testdiv.appendChild(endDate);
        testdiv.appendChild(endTime);
        testdiv.appendChild(location);
        testdiv.appendChild(program);
        testdiv.appendChild(kurs);
        testdiv.appendChild(moment);

        document.body.appendChild(testdiv);
    }
}