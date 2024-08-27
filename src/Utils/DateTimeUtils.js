import {
    format,
    addYears
} from "date-fns";
import thLocale from "date-fns/locale/th";
import enLocale from "date-fns/locale/en-US";

export const dateThaiFormat = dateTime => {//dateTime is new Date()
    const thmonth = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
    ];
    const dateThaiFormat = `${dateTime.getDate()} ${
        thmonth[dateTime.getMonth()]
    } ${0 + dateTime.getFullYear() + 543}`;

    return dateThaiFormat;
};

export const convertDateTimeToDisplayDate = (date, strFormat="d MMM yyyy HH:mm:ss", strLocal='en') => {//local =  'th' or 'en' || //date is new Date()
    try{
        const newDate = new Date(date);
        let localDetect = thLocale;
        let tmpDateTime = addYears(newDate, 543);
        if(strLocal === 'en'){
            tmpDateTime = newDate;
            localDetect = enLocale;
        }
        return format(tmpDateTime, strFormat, { locale: localDetect})
    }
    catch(err){
        return date;
    }
}

export const convertDatetimeToTimestamp = (date) => {//date is new Date()
    const newDate = new Date(date);
    return newDate.getTime()
}

export const convertTimestampToDateOnly = (date, strFormat="d MMM yyyy", strLocal='en') => {
    try{
        const newDate = new Date(date);
        let localDetect = thLocale;
        let tmpDateTime = addYears(newDate, 543);
        if(strLocal === 'en'){
            tmpDateTime = newDate;
            localDetect = enLocale;
        }
        return format(tmpDateTime, strFormat, { locale: localDetect})
    }
    catch(err){
        return date;
    }
}

export const convertTimestampToTimeOnly = (date, strFormat="hh:mm:ss", strLocal='th') => {
    try{
        const newDate = new Date(date);
        let localDetect = thLocale;
        let tmpDateTime = addYears(newDate, 543);
        if(strLocal === 'en'){
            tmpDateTime = newDate;
            localDetect = enLocale;
        }
        return format(tmpDateTime, strFormat, { locale: localDetect})
    }
    catch(err){
        return date;
    }
}

export const getDaysDiffBetweenDates = (dateInitial, dateFinal) => {
    try {
        const sumHours = 24 - new Date().getHours()
        const result = (dateFinal - dateInitial) / (1000 * 3600 * sumHours)
        return Math.trunc(result)
    } catch (error) {
        return error
    }
}