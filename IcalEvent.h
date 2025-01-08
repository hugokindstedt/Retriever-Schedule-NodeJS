#include <string>
#include <iostream>
using namespace std;

class IcalEvent{
    public:
        IcalEvent(string startDate, string endDate, string location, string program, string moment){
            this -> startDate = startDate;
            this -> endDate = endDate;
            this -> location = location;
            this -> program = program;
            this -> moment = moment;
        }

        void Print(){
            cout<<startDate<<endl;
            cout<<endDate<<endl;
            cout<<location<<endl;
            cout<<program<<endl;
            cout<<moment<<endl;
        }

    private:
        string startDate;
        string endDate;
        string location;
        string program;
        string moment;
};