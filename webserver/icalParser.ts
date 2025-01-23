import IcalEvent from "./IcalEvent.js";

const fs = require('node:fs');
const readline = require('readline');

function extractDate(date: string):string{
  let parsedDate: string = "N/A";

  let startIndex: number = 0;

  if(date.includes("DTSTART")){
    startIndex = "DTSTART:".length;
  }else if(date.includes("DTEND:")){
    startIndex = "DTEND:".length;
  }else{
    return "Error parsing date";
  }

  let endIndex: number = date.lastIndexOf("T");

  if(startIndex >= endIndex){
    return "Error parsing date"
  }else{
    parsedDate = date.slice(startIndex, endIndex);
  }

  return parsedDate;
}

function extractLocation(location: string):string{
  let parsedLocation: string = "N/A";

  let startIndex: number = "LOCATION:".length;
  
  parsedLocation = location.slice(startIndex);

  return parsedLocation;
}

function extractTime(date: string):string {
  let time: string = "N/A";
  
  let tPos: number = date.lastIndexOf("T");
  if(tPos === -1){
    return "Error extracting time";
  }else{
    time = date.slice(tPos+1, date.length);
    time = time.slice(0, time.indexOf("00Z"));
  }

  return time;
}

function parseSummary(summary: string):string[]{
  const arr: string[] = ["N/A2", "N/A2", "N/A2"];

  let programStart: number = 0,
      programEnd: number = 0,
      kursStart: number = 0,
      kursEnd: number = 0,
      momentStart: number = 0,
      momentEnd: number = 0;

  programStart = (summary.indexOf("Program: "))+("Program: ".length);
  programEnd = summary.indexOf("Kurs.grp: ")-1;
  if(programStart < programEnd){
    arr[0] = summary.slice(programStart, programEnd);
  }

  kursStart = (summary.indexOf("Kurs.grp: "))+("Kurs.grp: ".length);
  kursEnd = summary.indexOf("Sign: ")-1;
  if(kursStart < kursEnd){
    arr[1] = summary.slice(kursStart, kursEnd);
  }

  momentStart = (summary.indexOf("Moment: "))+("Moment: ".length);
  momentEnd = summary.indexOf("Aktivitetstyp: ")-1;
  if(momentStart < momentEnd){
    arr[2] = summary.slice(momentStart, momentEnd);
  }

  return arr;
}

function removeDuplicateWords(s: string):string{
  let newWord: string = "";
  const arr: string[] = s.split(" ");
  const words = new Set<string>;

  for(let word of arr){
    //console.log(word);
    words.add(word);
  }

  for(let word of words){
    //console.log(word);
    newWord = newWord.concat(word);
    newWord = newWord.concat(" ");
  }

  newWord = newWord.trimEnd();

  //console.log("newword: "+newWord);

  return newWord;
}

export default function parseIcalFile(filePath: string): Promise<IcalEvent[]>{
  return new Promise((resolve, reject) => {
    let startDate: string = "N/A",
        endDate: string = "N/A",
        startTime: string = "N/A",
        endTime: string = "N/A",
        location: string = "N/A",
        summary: string = "N/A",
        program: string = "N/A1",
        kurs: string = "N/A1",
        moment: string = "N/A1";

    const events: IcalEvent[] = [];
    
    const fileStream = fs.createReadStream(filePath);
      
    const rl = readline.createInterface({
      input: fileStream,
    });

    rl.on('line', (line: string) => {
      if(line.startsWith("DTSTART")){
        startDate = line;
      }else if(line.startsWith("DTEND")){
        endDate = line;
      }else if(line.startsWith("LOCATION:")){
        location = line;
      }else if(line.startsWith("SUMMARY")){
        summary = line;
      }else if(line.includes("END:VEVENT")){
        startTime = extractTime(startDate);
        endTime = extractTime(endDate);

        startDate = extractDate(startDate);
        endDate = extractDate(endDate);

        location = extractLocation(location);

        let summaryArr: string[] = parseSummary(summary);

        program = summaryArr[0];

        kurs = summaryArr[1];
        kurs = removeDuplicateWords(kurs);

        moment = summaryArr[2];

        const newEvent: IcalEvent = {startDate, endDate, startTime, endTime, location, program, kurs, moment};

        events.push(newEvent);

        /*console.log(startDate);
        console.log(startTime);
        console.log(endDate);
        console.log(endTime);
        console.log(program);
        console.log(kurs);
        console.log(moment);
        */
      }
    });


    rl.on('close', () => {
      //FILE READ
      resolve(events);
    });

    rl.on('error', (err: string) => {
      console.error(err);
      reject(err);
    });
  });
}