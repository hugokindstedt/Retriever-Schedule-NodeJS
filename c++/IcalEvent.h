#ifndef ICALEVENT_H
#define ICALEVENT_H

#include <string>
using namespace std;

class IcalEvent{
    public:
        IcalEvent(string startDate, string endDate, string startTime, string endTime, string location, string program, string kurs, string moment);

        IcalEvent(const IcalEvent& other);

        IcalEvent& operator = (const IcalEvent& other);

        void Print();

    private:
        string startDate;
        string endDate;
        string startTime;
        string endTime;
        string location;
        string program;
        string kurs;
        string moment;
};

#endif