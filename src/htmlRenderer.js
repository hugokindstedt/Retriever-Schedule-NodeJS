"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.renderTentaEvent = exports.renderEvent = exports.renderDay = exports.renderWeek = exports.renderSchema = exports.renderBody = exports.renderHTML = void 0;
function renderHTML(body) {
    var html = "";
    var header = "\n        <!DOCTYPE html>\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n            <link rel=\"stylesheet\" href=\"output.css\"/>\n            <link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\"/>\n            <link rel=\"apple-touch-icon\" href=\"apple-touch-icon.png\"/>\n            <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"apple-touch-icon_180x180.png\"/>\n            <title>Retriever|Schema</title>\n        </head>\n    ";
    html = html.concat(header, body);
    return html;
}
exports.renderHTML = renderHTML;
function renderBody(schema) {
    var body = "\n        <body class=\"bg-stone-200 dark:bg-dark-mode-background\">\n            ".concat(schema, "\n        </body>\n    ");
    return body;
}
exports.renderBody = renderBody;
function renderSchema(days) {
    var schemaConcat = "".concat.apply("", __spreadArray([], __read(days), false));
    var schema = "\n        <div id=\"schema\" class=\"mx-auto max-w-mid md:max-w-sm\">\n            ".concat(schemaConcat, "\n        </div>\n    ");
    return schema;
}
exports.renderSchema = renderSchema;
// Week template
function renderWeek(days, week) {
    var weekConcat = "".concat.apply("", __spreadArray([], __read(days), false));
    var weekTemp = "\n        <div id=\"week\" class=\"mb-4 py-2\">\n            <div class=\"flex items-center\">\n                <span id=\"weekNumber\" class=\"mr-2 font-semibold dark:text-gray-400\">V. ".concat(week, "</span>\n                <div class=\"flex-grow border-t border-black dark:border-gray-400\"></div>\n            </div>\n            ").concat(weekConcat, "\n        </div>\n    ");
    return weekTemp;
}
exports.renderWeek = renderWeek;
// Day template
function renderDay(events, date) {
    var eventsConcat = "".concat.apply("", __spreadArray([], __read(events), false));
    var dayTemp = "\n        <div id=\"day\" class=\"mb-4 py-2 pl-4 rounded-lg shadow-all-sides, bg-white dark:bg-gray-700\">\n            <h2 id=\"date\" class=\"font-bold dark:text-gray-400\">".concat(date, "</h2>\n            ").concat(eventsConcat, "\n        </div>\n    ");
    return dayTemp;
}
exports.renderDay = renderDay;
// Event template
function renderEvent(time, kurs, moment, location, sign) {
    var eventTemp = "\n        <div id=\"event\" class=\"p-1 group\">\n            <p id=\"time\" class=\"font-semibold dark:text-gray-400\">".concat(time, "</p>\n            <p id=\"kurs\" class=\"text-orange-500 \">").concat(kurs, "</p>\n            <p id=\"moment\" class=\"dark:text-gray-400\">").concat(moment, "</p>\n            <p id=\"location\"class=\"dark:text-gray-400\">").concat(location, "</p>\n            <p id=\"sign\" class=\"hidden group-hover:flex dark:text-gray-400\">").concat(sign, "</p>\n        </div>\n    ");
    return eventTemp;
}
exports.renderEvent = renderEvent;
function renderTentaEvent(time, kurs, moment, location, sign) {
    var eventTemp = "\n        <div id=\"event\" class=\"p-1 group\">\n            <p id=\"time\" class=\"font-semibold dark:text-gray-400\">".concat(time, "</p>\n            <p id=\"kurs\" class=\"text-orange-500 \">").concat(kurs, "</p>\n            <p id=\"moment\" class=\"p-1 inline-block bg-amber-500 rounded-md\">").concat(moment, "</p>\n            <p id=\"location\"class=\"dark:text-gray-400\">").concat(location, "</p>\n            <p id=\"sign\" class=\"hidden group-hover:flex dark:text-gray-400\">").concat(sign, "</p>\n        </div>\n    ");
    return eventTemp;
}
exports.renderTentaEvent = renderTentaEvent;
