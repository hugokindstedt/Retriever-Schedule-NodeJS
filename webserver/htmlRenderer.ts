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
        <body>
            ${schema}
        </body>
    `;

    return body;
}

export function renderSchema(days: string[]):string{
    let schemaConcat: string = "".concat(...days);

    let schema:string = `
        <div id="schema" class="bg-gray-50 mx-auto max-w-sm">
            ${schemaConcat}
        </div>
    `;

    return schema;
}

// Day template
export function renderDay(events: string[], date: string):string{
    let eventsConcat: string = "".concat(...events);

    let dayTemp: string = `
        <div class="my-2 shadow bg-blue-300">
        <!--<div class="my-2 bg-white shadow rounded hover:shadow-lg transition-shadow">-->
            <h2 id="date">${date}</h2>
            <div id="events">
                ${eventsConcat}
            </div>
        </div>
    `;

    return dayTemp;
}

// Event template
export function renderEvent(time: string, kurs: string, moment: string, location: string):string{
    let eventTemp: string = `
        <div class="p-1 bg-white">
            <p id="time" class="font-semibold">${time}</p>
            <p id="kurs" class="text-orange-500">${kurs}</p>
            <p id="moment">${moment}</p>
            <p id="location">${location}</p>
        </div>
    `;

    return eventTemp;
}