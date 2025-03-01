export function renderHTML(body: string):string{
    let html: string = "";
    
    const header: string = `
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="output.css">
            <title>Retriever</title>
        </head>
    `;

    html = html.concat(header, body);

    return html;
}

export function renderBody(schema: string):string{
    let body:string = `
        <body class="bg-stone-200">
            ${schema}
        </body>
    `;

    return body;
}

export function renderSchema(days: string[]):string{
    let schemaConcat: string = "".concat(...days);

    let schema:string = `
        <div id="schema" class="mx-auto max-w-sm">
            ${schemaConcat}
        </div>
    `;

    return schema;
}

// Week template
export function renderWeek(days: string[], week: string):string{
    let weekConcat: string = "".concat(...days);

    let weekTemp: string = `
        <div id="week" class="mb-4 py-2">
            <div class="flex items-center">
                <span id="weekNumber" class="mr-2 font-semibold">V. ${week}</span>
                <div class="flex-grow border-t border-black"></div>
            </div>
            ${weekConcat}
        </div>
    `;

    return weekTemp;
}

// Day template
export function renderDay(events: string[], date: string):string{
    let eventsConcat: string = "".concat(...events);

    let dayTemp: string = `
        <div id="day" class="mb-4 py-2 pl-4 rounded-lg shadow-all-sides, bg-white">
            <h2 id="date" class="font-bold">${date}</h2>
            ${eventsConcat}
        </div>
    `;

    return dayTemp;
}

// Event template
export function renderEvent(time: string, kurs: string, moment: string, location: string):string{
    let eventTemp: string = `
        <div id="event" class="p-1">
            <p id="time" class="font-semibold">${time}</p>
            <p id="kurs" class="text-orange-500">${kurs}</p>
            <p id="moment">${moment}</p>
            <p id="location">${location}</p>
        </div>
    `;

    return eventTemp;
}