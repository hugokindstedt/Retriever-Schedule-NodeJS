using namespace std;
#include <iostream>
#include <fstream>

#include "IcalEvent.h"

void LoadFile(string fileName){
    string textLine;

    ifstream icalFile(fileName);

    // Skip VCALENDAR beginning
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);

    while(!icalFile.eof()){
        // Skip BEGIN:VEVENT
        getline(icalFile, textLine);
        
        string startDate;
        getline(icalFile, startDate);

        string endDate;
        getline(icalFile, endDate);

        // Skip DTSTAMP, UID, CREATED, LAST-MODIFIED
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);

        string location;
        getline(icalFile, location);

        // Skip SEQUENCE, STATUS
        getline(icalFile, textLine);
        getline(icalFile, textLine);

        string summary;
        getline(icalFile, summary);

        // Find program
        int programStart = summary.find("Program: ");
        if(programStart != -1) programStart += 9;
        int programEnd = summary.find("Kurs.grp: ");
        if(programEnd != -1) programEnd -= programStart;

        string program;
        if(programStart == -1 || programEnd == -1){
            program = "N/A";
        }else{
            program = summary.substr(programStart, programEnd);
            cout<<program<<endl;
        }

        // Find Kurs
        int kursStart = summary.find("Kurs.grp: ");
        if(kursStart != -1) kursStart += 10;
        int kursEnd = summary.find("Sign: ");
        if(kursEnd != -1) kursEnd -= kursStart;

        string kurs;
        if(kursStart == -1 || kursEnd == -1){
            kurs = "N/A";
        }else{
            kurs = summary.substr(kursStart, kursEnd);
            cout<<kurs<<endl;
        }

        // Find moment
        int momentStart = summary.find("Moment: ");
        if(momentStart != -1) momentStart += 8;
        int momentEnd = summary.find("Aktivitetstyp: ");
        if(momentEnd != -1) momentEnd -= momentStart;

        string moment;
        if(momentStart == -1 || momentEnd == -1){
            moment = "N/A";
        }else{
            moment = summary.substr(momentStart, momentEnd);
            cout<<moment<<endl;
        }

        //Skip TRANSP, X-MICROSOFT, END:VEVENT
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);

        cout<<"-------------------"<<endl;
    }
    
}

int main(){
    LoadFile("SchemaICAL.ics");
}