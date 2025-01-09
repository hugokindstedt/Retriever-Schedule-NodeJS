#include "IcalEvent.h"
#include <vector>

class IcalCalendar{
    public:
        IcalCalendar();

        

    private:
        std::vector<IcalEvent> events;
        
};