export default class IcalEvent{
    startDate: string;  
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    program: string;
    kurs: string;
    moment: string;

    constructor(startDate: string, endDate: string, startTime: string, endTime: string, location: string, program: string, kurs: string, moment: string){
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.program = program;
        this.kurs = kurs;
        this.moment = moment;
    }
}