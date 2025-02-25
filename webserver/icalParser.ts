import IcalEvent from "./IcalEvent.js";

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
  const summaryStruct = {
    program: "NO PROGRAM",
    kurs: "NO COURSE",
    moment: "NO MOMENT"
  };
  
//Program: Kurs.grp: Sign: Moment: Aktivitetstyp:

  let programStart: number = 0,
  programEnd: number = 0,
  kursStart: number = 0,
  kursEnd: number = 0,
  momentStart: number = 0,
  momentEnd: number = 0;

  const programExists: boolean = summary.includes("Program: ");
  const kursExists: boolean = summary.includes("Kurs.grp: ");
  const signExists: boolean = summary.includes("Sign: ");
  const momentExists: boolean = summary.includes("Moment: ");
  const aktivitetstypExists: boolean = summary.includes("Aktivitetstyp: ");
  
  if(programExists){
    programStart = (summary.indexOf("Program: "))+("Program: ".length);
    
    if(kursExists){
      programEnd = summary.indexOf("Kurs.grp: ")-1;
    }else if(signExists){
      programEnd = summary.indexOf("Sign: ")-1;
    }else if(momentExists){
      programEnd = summary.indexOf("Moment: ")-1;
    }else if(aktivitetstypExists){
      programEnd = summary.indexOf("Aktivitetstyp: ")-1;
    }
    
    arr[0] = summary.slice(programStart, programEnd);
  }
  
  if(kursExists){
    kursStart = (summary.indexOf("Kurs.grp: "))+("Kurs.grp: ".length);

    if(signExists){
      kursEnd = summary.indexOf("Sign: ")-1;
    }else if(momentExists){
      kursEnd = summary.indexOf("Moment: ")-1;
    }else if(aktivitetstypExists){
      kursEnd = summary.indexOf("Aktivitetstyp: ")-1;
    }else{
      kursEnd = summary.length -1;
    }

    arr[1] = summary.slice(kursStart, kursEnd);
  }

  if(momentExists){
    momentStart = (summary.indexOf("Moment: "))+("Moment: ".length);

    if(aktivitetstypExists){
      momentEnd = summary.indexOf("Aktivitetstyp: ")-1;
    }else{
      momentEnd = summary.length -1;
    }
    
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

export default function parseIcalToJson(icalFile: string): IcalEvent[]{
  let startDate: string = "N/A",
  endDate: string = "N/A",
  startTime: string = "N/A",
  endTime: string = "N/A",
  location: string = "N/A",
  summary: string = "N/A",
  program: string = "N/A",
  kurs: string = "N/A",
  moment: string = "N/A";
  
  const events: IcalEvent[] = [];

  /*
  if(icalFile !== 'string'){
    console.log("WTF");
  }
  */
  
  const icalFileLines = icalFile.split(/\r?\n/);
  
  for(let line of icalFileLines){
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
      
      const newEvent = new IcalEvent(startDate, endDate, startTime, endTime, location, program, kurs, moment);
      
      events.push(newEvent);
    }
  }
  return events;
}