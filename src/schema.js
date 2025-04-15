"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function formatTime(time) {
    var formattedTime = time.slice(0, 2) + ":" + time.slice(2);
    return formattedTime;
}
function zuluToCET(timeString) {
    var newTime = "N/A";
    if (timeString.startsWith("23")) {
        newTime = "00" + timeString.slice(2);
        return newTime;
    }
    var time = parseInt(timeString);
    time += 100;
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
/*
function addSubmitListener(){
    console.log("hehehehhjhjjgfhsdfh!!!!");
    let submitButton = document.querySelector("form");

    submitButton?.addEventListener("submit", createSchema);
}
*/
function getSchema() {
    return new Promise(function (resolve, reject) {
        var schema = [];
        var urlInput = document.getElementById("hugo");
        console.log(urlInput.value);
        var testuri = encodeURIComponent(urlInput.value);
        console.log(testuri);
        var urltest = "http://localhost:3000/?link=".concat(testuri);
        console.log(urltest);
        var url = new URL(urltest);
        fetch(url)
            .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error! Status: ".concat(response.status));
            }
            // Parse the response as JSON
            return response.json();
        })
            .then(function (data) {
            var e_1, _a;
            try {
                for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var event_1 = data_1_1.value;
                    schema.push(event_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_a = data_1["return"])) _a.call(data_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            resolve(schema);
        })["catch"](function (error) {
            console.error('Error fetching the data:', error);
            reject(error);
        });
    });
}
function createSchema() {
    return __awaiter(this, void 0, void 0, function () {
        var schema, error_1, event_template, day_template, day, i, day_clone, events, formattedDate, day_1, day_1_1, event2, tclone, tclone;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("kört");
                    schema = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getSchema()];
                case 2:
                    schema = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("Error getting schema: ".concat(error_1));
                    // GÖR ERROR RUTA
                    return [2 /*return*/];
                case 4:
                    event_template = document.getElementById("event_card");
                    day_template = document.getElementById("day_card");
                    while (schema.length != 0) {
                        day = [];
                        day.push(schema[0]);
                        // Group events on the same day into array "day"
                        for (i = 1; i < schema.length; i++) {
                            if (schema[i].startDate === schema[0].startDate) {
                                day.push(schema[i]);
                                schema.splice(i, 1);
                            }
                        }
                        day_clone = day_template.content.cloneNode(true);
                        events = day_clone.querySelector("#events");
                        formattedDate = schema[0].startDate.slice(0, 4) + "-" + schema[0].startDate.slice(4, 6) + "-" + schema[0].startDate.slice(6);
                        day_clone.querySelector("#date").textContent = formattedDate + " " + getDay(schema[0].startDate);
                        // Behövs ens denna if?
                        if (day.length > 1) {
                            try {
                                // If several events on the same day
                                for (day_1 = (e_2 = void 0, __values(day)), day_1_1 = day_1.next(); !day_1_1.done; day_1_1 = day_1.next()) {
                                    event2 = day_1_1.value;
                                    tclone = event_template.content.cloneNode(true);
                                    // FULT
                                    tclone.querySelector("#time").textContent = formatTime(zuluToCET(event2.startTime)) + " - " + formatTime(zuluToCET(event2.endTime));
                                    tclone.querySelector("#kurs").textContent = event2.kurs;
                                    tclone.querySelector("#moment").textContent = event2.moment;
                                    tclone.querySelector("#location").textContent = event2.location;
                                    //const seperator = document.createElement("div");
                                    //seperator.className = "border-t border-gray-300 my-2";
                                    events.appendChild(tclone);
                                    //events!.appendChild(seperator);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (day_1_1 && !day_1_1.done && (_a = day_1["return"])) _a.call(day_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        else {
                            tclone = event_template.content.cloneNode(true);
                            tclone.querySelector("#time").textContent = formatTime(zuluToCET(schema[0].startTime)) + " - " + formatTime(zuluToCET(schema[0].endTime));
                            tclone.querySelector("#kurs").textContent = schema[0].kurs;
                            tclone.querySelector("#moment").textContent = schema[0].moment;
                            tclone.querySelector("#location").textContent = schema[0].location;
                            events.appendChild(tclone);
                        }
                        document.body.querySelector("#schema").appendChild(day_clone);
                        schema.splice(0, 1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//var form = document.getElementById("hugo");
//form!.addEventListener("submit", createSchema, true);
