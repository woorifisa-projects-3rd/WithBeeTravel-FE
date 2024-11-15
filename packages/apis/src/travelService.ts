import { instance } from './instance';
// import { ErrorResponse } from './instance';

export const createTravel = async(
    travelName: number,
    isDomesticTravel: Boolean,
    travelCountries: string[],
    travelStartDate: string,
    travelEndDate: string
)=> {
    return instance.post(
        `/api/travels`,
    {
       body: JSON.stringify({
            travelName,
            isDomesticTravel,
            travelCountries,
            travelStartDate,
            travelEndDate
       }),
    })

    
}