const moment = require("jalali-moment");
const { Err } = require("./error");

moment.locale("fa");

const standardFullDateFormat = "YYYY-MM-DD HH:mm";
const standardDateFormat = "YYYY-MM-DD";
const standardTimeFormat = "HH:mm";

const handleDate = (requestedDate, currentDate) => {
  let date = moment();
  switch (requestedDate) {
    case "now":
      break;

    case "next":
      date = moment(currentDate).add(1, "day");
      break;

    case "prev":
      date = moment(currentDate).subtract(1, "day");
      break;

    default:
      date =
        requestedDate.length === 16
          ? moment(requestedDate, standardFullDateFormat)
          : moment(requestedDate);
      break;
  }
  return prepareAllDateFormats(date);
};

const prepareAllDateFormats = (date) => {
  try {
    const result = {
      faFullDate: date.format(standardFullDateFormat),
      enFullDate: date.clone().locale("en").format(standardFullDateFormat),
      faDate: date.format(standardDateFormat),
      enDate: moment(date.format(standardDateFormat), standardDateFormat)
        .locale("en")
        .format(standardDateFormat),
      month: date.format("MMMM"),
      day: date.format("dddd"),
    };
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// const getDate = (date, format) => {
//   try {
//     let mDate = date
//       ? format
//         ? moment(date, format)
//         : moment.isMoment(date)
//         ? date
//         : moment(date, standardFullDateFormat)
//       : moment();
//     mDate = mDate.isValid() ? mDate : moment(new Date(date));
//     const result = {
//       faFullDate: mDate.format(standardFullDateFormat),
//       enFullDate: mDate.clone().locale("en").format(standardFullDateFormat),
//       faDate: mDate.format(standardDateFormat),
//       enDate: moment(mDate.format(standardDateFormat), standardDateFormat)
//         .locale("en")
//         .format(standardDateFormat),
//       time: mDate.format(standardTimeFormat),
//       month: mDate.format("MMMM"),
//       day: mDate.format("dddd"),
//       isFromGetDate: true,
//     };
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

// const getTime = (time, format) => {
//   try {
//     const mTime = time
//       ? format
//         ? moment(time, format)
//         : moment.isMoment(time)
//         ? time.startOf("minute")
//         : moment(time, standardTimeFormat)
//       : moment().startOf("minute");
//     const result = mTime.format(standardTimeFormat);
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

// const nextDayDate = (currentDayDate, currentDayFormat) => {
//   try {
//     const mDate = currentDayDate
//       ? moment(currentDayDate, currentDayFormat || standardFullDateFormat)
//       : moment();
//     const mNextDay = mDate.add(1, "day");
//     const result = getDate(mNextDay);
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

// const prevDayDate = (currentDayDate, currentDayFormat) => {
//   try {
//     const mDate = currentDayDate
//       ? moment(currentDayDate, currentDayFormat || standardFullDateFormat)
//       : moment();
//     const mPrevDay = mDate.subtract(1, "day");
//     const result = getDate(mPrevDay);
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

// const getDateRange = (startDate, endDate, format) => {
//   const now = moment().startOf("day");
//   try {
//     let mStart;
//     let mEnd;
//     if (!startDate) {
//       mStart = mEnd = now;
//     } else {
//       const sd = moment(startDate, format || standardDateFormat);
//       if (!endDate) {
//         if (sd.isAfter(now)) {
//           mStart = now;
//           mEnd = sd;
//         } else {
//           mStart = sd;
//           mEnd = now;
//         }
//       } else {
//         const ed = moment(endDate, format || standardDateFormat);
//         mStart = sd;
//         mEnd = ed;
//       }
//     }
//     const dateRange = [];
//     let i = 0;
//     while (mStart.clone().add(i, "day").isSameOrBefore(mEnd)) {
//       dateRange.push(mStart.clone().add(i, "day"));
//       i++;
//     }
//     const result = dateRange.map((item) => getDate(item));
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

// const getTimeRange = (startTime, endTime, periodInMinute = 1, format) => {
//   const now = moment().startOf("minute");

//   try {
//     let mStart;
//     let mEnd;
//     if (!startTime) {
//       mStart = mEnd = now;
//     } else {
//       const sd = moment(startTime, format || standardTimeFormat);
//       if (!endTime) {
//         if (sd.isAfter(now)) {
//           mStart = now;
//           mEnd = sd;
//         } else {
//           mStart = sd;
//           mEnd = now;
//         }
//       } else {
//         const ed = moment(endTime, format || standardTimeFormat);
//         mStart = sd;
//         mEnd = ed;
//       }
//     }

//     const timeRange = [];
//     let i = 0;
//     while (
//       mStart
//         .clone()
//         .add(periodInMinute * i, "m")
//         .isSameOrBefore(mEnd)
//     ) {
//       timeRange.push(mStart.clone().add(periodInMinute * i, "m"));
//       i++;
//     }
//     const result = timeRange.map((item) =>
//       moment(item).format(standardTimeFormat)
//     );
//     return result;
//   } catch (error) {
//     return error;
//   }
// };

module.exports = {
  handleDate,
  prepareAllDateFormats,
};
