import moment from "moment/moment";
import {DayName} from "../../types/SimulationTypes";
 function slotToMoment(time: string, day: DayName) {
    const timeMoment = moment(time, ["HH:mm"])

    return moment({
        year: 2023,
        month: 0,
        day: 1 + Object.values(DayName).indexOf(day),
        hour: timeMoment.hour(),
        minutes: timeMoment.minutes()
    }).toDate()
}

export {slotToMoment}