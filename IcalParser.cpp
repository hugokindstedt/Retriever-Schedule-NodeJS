using namespace std;
#include <iostream>
#include <fstream>
#include <vector>

#include "IcalEvent.h"

/*
    Trims whitespace from beginning and end of string s
*/
void TrimWhiteSpace(string& s){
    s.erase(0, s.find_first_not_of(" \t\r\n"));
    s.erase(s.find_last_not_of(" \t\r\n") + 1);
}

void RemoveDuplicateWords(string& s){
    vector<string> words;
    string temp;
    string org = s;
    string newString;
    bool duplicateFlag = false;

    TrimWhiteSpace(s);

    while(!s.empty()){
        temp = s.substr(0, s.find(" "));
        if(words.empty()){
            words.push_back(temp);
        }else{
            for(string i : words){
                if(i.compare(temp) == 0){
                    duplicateFlag = true;
                }
            }
            if(!duplicateFlag){
                words.push_back(temp);
            }
        }
        s = s.substr(s.find(" ")+1, s.length());
        if(s.find(" ") == -1){
            // BUGGAD
            break;
        }
    }

    for(string i : words){
        newString.append(i);
        newString.append(" ");
    }
    s = newString;
}

int LoadFile(string fileName, vector <IcalEvent> &schedule){
    string textLine;
    string whileCond("END:VCALENDAR");

    ifstream icalFile(fileName);
    if(!icalFile.good()){
        cout<<"ERROR reading file"<<endl;
        return 1;
    }

    // Skip VCALENDAR beginning
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);
    getline(icalFile, textLine);

    // Read BEGIN:VEVENT
    getline(icalFile, textLine);

    while(textLine.compare(whileCond) != 0){
        string startDate;
        getline(icalFile, startDate);
        // Trim string
        startDate = startDate.substr(8, startDate.length()-12);

        string startTime;
        startTime = startDate.substr(startDate.find("T")+1, startDate.length());

        startDate = startDate.substr(0, startDate.find("T"));

        string endDate;
        getline(icalFile, endDate);
        // Trim string
        endDate = endDate.substr(6, endDate.length()-(4+6));

        string endTime;
        endTime = endDate.substr(endDate.find("T")+1, endDate.length());

        endDate = endDate.substr(0, endDate.find("T"));

        // Skip DTSTAMP, UID, CREATED, LAST-MODIFIED
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);

        string location;
        getline(icalFile, location);
        // Trim string
        location = location.substr(9, location.length());

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
        }

        TrimWhiteSpace(startDate);
        TrimWhiteSpace(endDate);
        TrimWhiteSpace(location);
        TrimWhiteSpace(program);
        TrimWhiteSpace(kurs);
        TrimWhiteSpace(moment);

        RemoveDuplicateWords(kurs);

        IcalEvent newEvent = IcalEvent(startDate, endDate, startTime, endTime, location, program, kurs, moment);
        schedule.push_back(newEvent);

        //Skip TRANSP, X-MICROSOFT, END:VEVENT
        getline(icalFile, textLine);
        getline(icalFile, textLine);
        getline(icalFile, textLine);

        // Read next BEGIN:VEVENT or END:VCALENDAR
        getline(icalFile, textLine);
        // Trim for trailing whitespace/special characters
        TrimWhiteSpace(textLine);
        //textLine.erase(0, textLine.find_first_not_of(" \t\r\n"));
        //textLine.erase(textLine.find_last_not_of(" \t\r\n") + 1);
    }
    return 0;
}

int main(){
    /*vector <IcalEvent> schedule;
    LoadFile("SchemaICAL.ics", schedule);

    for(IcalEvent i : schedule){
        i.Print();
        cout<<endl;
    }
    */
   string test = "System- och programvaruutveckling";
   cout<<test<<endl;
   RemoveDuplicateWords(test);
   cout<<test<<endl;
}