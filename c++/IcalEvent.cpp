#include "IcalEvent.h"

#include <string>
#include <iostream>

using namespace std;

IcalEvent::IcalEvent(string startDate, string endDate, string startTime, string endTime, string location, string program, string kurs, string moment){
    this->startDate = startDate;
    this->endDate = endDate;
    this->startTime = startTime;
    this->endTime = endTime;
    this->location = location;
    this->program = program;
    this->kurs = kurs;
    this->moment = moment;
}

IcalEvent::IcalEvent(const IcalEvent& other){
    this->startDate = other.startDate; 
    this->endDate = other.endDate;
    this->startTime = other.startTime;
    this->endTime = other.endTime;
    this->location = other.location;
    this->program = other.program;
    this->kurs = other.kurs;
    this->moment = other.moment;
}

IcalEvent& IcalEvent::operator = (const IcalEvent& other){
    this->startDate = other.startDate; 
    this->endDate = other.endDate;
    this->startTime = other.startTime;
    this->endTime = other.endTime;
    this->location = other.location;
    this->program = other.program;
    this->kurs = other.kurs;
    this->moment = other.moment;

    return *this;
}

void IcalEvent::Print(){
    cout<<"Start date: "+startDate<<endl;
    cout<<"End date: "+endDate<<endl;
    cout<<"Start time: "+startTime<<endl;
    cout<<"End time: "+endTime<<endl;
    cout<<"Location: "+location<<endl;
    cout<<"Program: "+program<<endl;
    cout<<"Kurs: "+kurs<<endl;
    cout<<"Moment: "+moment<<endl;
}