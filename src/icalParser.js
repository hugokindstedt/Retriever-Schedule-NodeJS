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
var IcalEvent_js_1 = require("./IcalEvent.js");
function extractDate(date) {
    var parsedDate = "N/A";
    var startIndex = 0;
    if (date.includes("DTSTART")) {
        startIndex = "DTSTART:".length;
    }
    else if (date.includes("DTEND:")) {
        startIndex = "DTEND:".length;
    }
    else {
        return "Error parsing date";
    }
    var endIndex = date.lastIndexOf("T");
    if (startIndex >= endIndex) {
        return "Error parsing date";
    }
    else {
        parsedDate = date.slice(startIndex, endIndex);
    }
    return parsedDate;
}
function extractLocation(location) {
    var parsedLocation = "N/A";
    var startIndex = "LOCATION:".length;
    parsedLocation = location.slice(startIndex);
    return parsedLocation;
}
function extractTime(date) {
    var time = "N/A";
    var tPos = date.lastIndexOf("T");
    if (tPos === -1) {
        return "Error extracting time";
    }
    else {
        time = date.slice(tPos + 1, date.length);
        time = time.slice(0, time.indexOf("00Z"));
    }
    return time;
}
function parseSummary(summary) {
    //const arr: string[] = ["N/A2", "N/A2", "N/A2"];
    /*const summaryStruct = {
      program: "NO PROGRAM",
      kurs: "NO COURSE",
      moment: "NO MOMENT"
    };*/
    var summaryMap = new Map();
    summaryMap.set('program', 'NO PROGRAM');
    summaryMap.set('course', 'NO COURSE');
    summaryMap.set('sign', 'NO SIGN');
    summaryMap.set('moment', 'NO MOMENT');
    //Program: Kurs.grp: Sign: Moment: Aktivitetstyp:
    var programStart = 0, programEnd = 0, kursStart = 0, kursEnd = 0, signStart = 0, signEnd = 0, momentStart = 0, momentEnd = 0;
    var programExists = summary.includes("Program: ");
    var kursExists = summary.includes("Kurs.grp: ");
    var signExists = summary.includes("Sign: ");
    var momentExists = summary.includes("Moment: ");
    var aktivitetstypExists = summary.includes("Aktivitetstyp: ");
    if (programExists) {
        programStart = (summary.indexOf("Program: ")) + ("Program: ".length);
        if (kursExists) {
            programEnd = summary.indexOf("Kurs.grp: ") - 1;
        }
        else if (signExists) {
            programEnd = summary.indexOf("Sign: ") - 1;
        }
        else if (momentExists) {
            programEnd = summary.indexOf("Moment: ") - 1;
        }
        else if (aktivitetstypExists) {
            programEnd = summary.indexOf("Aktivitetstyp: ") - 1;
        }
        summaryMap.set('program', summary.slice(programStart, programEnd));
    }
    if (kursExists) {
        kursStart = (summary.indexOf("Kurs.grp: ")) + ("Kurs.grp: ".length);
        if (signExists) {
            kursEnd = summary.indexOf("Sign: ") - 1;
        }
        else if (momentExists) {
            kursEnd = summary.indexOf("Moment: ") - 1;
        }
        else if (aktivitetstypExists) {
            kursEnd = summary.indexOf("Aktivitetstyp: ") - 1;
        }
        else {
            kursEnd = summary.length - 1;
        }
        summaryMap.set('kurs', summary.slice(kursStart, kursEnd));
    }
    if (signExists) {
        signStart = (summary.indexOf("Sign: ")) + ("Sign: ".length);
        if (momentExists) {
            signEnd = summary.indexOf("Moment: ") - 1;
        }
        else if (aktivitetstypExists) {
            signEnd = summary.indexOf("Aktivitetstyp: ") - 1;
        }
        else {
            signEnd = summary.length - 1;
        }
        summaryMap.set('sign', summary.slice(signStart, signEnd));
    }
    if (momentExists) {
        momentStart = (summary.indexOf("Moment: ")) + ("Moment: ".length);
        if (aktivitetstypExists) {
            momentEnd = summary.indexOf("Aktivitetstyp: ") - 1;
        }
        else {
            momentEnd = summary.length - 1;
        }
        summaryMap.set('moment', summary.slice(momentStart, momentEnd));
    }
    return summaryMap;
}
function removeDuplicateWords(s) {
    var e_1, _a, e_2, _b;
    var newWord = "";
    var arr = s.split(" ");
    var words = new Set;
    try {
        for (var arr_1 = __values(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
            var word = arr_1_1.value;
            //console.log(word);
            words.add(word);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (arr_1_1 && !arr_1_1.done && (_a = arr_1["return"])) _a.call(arr_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        for (var words_1 = __values(words), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
            var word = words_1_1.value;
            //console.log(word);
            newWord = newWord.concat(word);
            newWord = newWord.concat(" ");
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (words_1_1 && !words_1_1.done && (_b = words_1["return"])) _b.call(words_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    newWord = newWord.trimEnd();
    //console.log("newword: "+newWord);
    return newWord;
}
function parseIcalToJson(icalFile) {
    var e_3, _a;
    var startDate = "N/A", endDate = "N/A", startTime = "N/A", endTime = "N/A", location = "N/A", summary = "N/A", program = "N/A", kurs = "N/A", sign = "N/A", moment = "N/A";
    var events = [];
    /*
    if(icalFile !== 'string'){
      console.log("WTF");
    }
    */
    var icalFileLines = icalFile.split(/\r?\n/);
    try {
        for (var icalFileLines_1 = __values(icalFileLines), icalFileLines_1_1 = icalFileLines_1.next(); !icalFileLines_1_1.done; icalFileLines_1_1 = icalFileLines_1.next()) {
            var line = icalFileLines_1_1.value;
            if (line.startsWith("DTSTART")) {
                startDate = line;
            }
            else if (line.startsWith("DTEND")) {
                endDate = line;
            }
            else if (line.startsWith("LOCATION:")) {
                location = line;
            }
            else if (line.startsWith("SUMMARY")) {
                summary = line;
            }
            else if (line.includes("END:VEVENT")) {
                startTime = extractTime(startDate);
                endTime = extractTime(endDate);
                startDate = extractDate(startDate);
                endDate = extractDate(endDate);
                location = extractLocation(location);
                var summaryMap = parseSummary(summary);
                program = summaryMap.get('program');
                kurs = summaryMap.get('kurs');
                kurs = removeDuplicateWords(kurs);
                sign = summaryMap.get('sign');
                moment = summaryMap.get('moment');
                var newEvent = new IcalEvent_js_1["default"](startDate, endDate, startTime, endTime, location, program, kurs, sign, moment);
                events.push(newEvent);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (icalFileLines_1_1 && !icalFileLines_1_1.done && (_a = icalFileLines_1["return"])) _a.call(icalFileLines_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return events;
}
exports["default"] = parseIcalToJson;
