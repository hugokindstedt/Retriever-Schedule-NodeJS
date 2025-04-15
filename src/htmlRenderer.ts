export function renderHTML(body: string):string{
    let html: string = "";
    
    const header: string = `
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="output.css"/>
            <link rel="icon" type="image/x-icon" href="favicon.ico"/>
            <link rel="apple-touch-icon" href="apple-touch-icon.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon_180x180.png"/>
            <title>Retriever|Schema</title>
        </head>
    `;

    html = html.concat(header, body);

    return html;
}

export function renderBody(schema: string):string{
    let body:string = `
        <body class="bg-stone-200 dark:bg-dark-mode-background">
            ${schema}
        </body>
    `;

    return body;
}

export function renderSchema(days: string[]):string{
    let schemaConcat: string = "".concat(...days);

    let schema:string = `
        <div id="schema" class="mx-auto max-w-mid md:max-w-sm">
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
                <span id="weekNumber" class="mr-2 font-semibold dark:text-gray-400">V. ${week}</span>
                <div class="flex-grow border-t border-black dark:border-gray-400"></div>
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
        <div id="day" class="mb-4 py-2 pl-4 rounded-lg shadow-all-sides, bg-white dark:bg-gray-700">
            <h2 id="date" class="font-bold dark:text-gray-400">${date}</h2>
            ${eventsConcat}
        </div>
    `;

    return dayTemp;
}

// Event template
export function renderEvent(time: string, kurs: string, moment: string, location: string, sign:string):string{
    let eventTemp: string = `
        <div id="event" class="p-1 group">
            <p id="time" class="font-semibold dark:text-gray-400">${time}</p>
            <p id="kurs" class="text-orange-500 ">${kurs}</p>
            <p id="moment" class="dark:text-gray-400">${moment}</p>
            <p id="location"class="dark:text-gray-400">${location}</p>
            <p id="sign" class="hidden group-hover:flex dark:text-gray-400">${sign}</p>
        </div>
    `;

    return eventTemp;
}

export function renderTentaEvent(time: string, kurs: string, moment: string, location: string, sign: string):string{
    let eventTemp: string = `
        <div id="event" class="p-1 group">
            <p id="time" class="font-semibold dark:text-gray-400">${time}</p>
            <p id="kurs" class="text-orange-500 ">${kurs}</p>
            <p id="moment" class="p-1 inline-block bg-amber-500 rounded-md">${moment}</p>
            <p id="location"class="dark:text-gray-400">${location}</p>
            <p id="sign" class="hidden group-hover:flex dark:text-gray-400">${sign}</p>
        </div>
    `;

    return eventTemp;
}