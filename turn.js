const { getDate, getTime, getTimeRange } = require("./moment");
const { generateProps } = require("./prop");

const generateTurnsByDate = (date, startTime, endTime, periodInMinute) => {
  try {
    const fullRange = getTimeRange(
      getTime(startTime),
      getTime(endTime),
      periodInMinute
    );
    const result = fullRange.map((item) => `${getDate(date).faDate} ${item}`);
    return result;
  } catch (error) {
    return error;
  }
};

const initTrun = (turnTimeTxt, dbTurnContent, props) => {
  const result = {
    title: turnTimeTxt,
    content: dbTurnContent,
    properties: [],
  };
  if (dbTurnContent) {
    result.properties = generateProps(dbTurnContent, [
      "refname",
      "refphone",
      "description",
      "doctorName",
      "operatorName",
    ]);
    result
  }
  if (props) {
    result.properties.push(...props);
  }
  return result;
};

const prepareTurns = (date, initiatedTurns) => {
  if (!date.isFromGetDate) {
    date = getDate(date);
  }
  if (Array.isArray(initiatedTurns)) {
    return {
      calendar: date,
      turns: initiatedTurns,
    };
  }
};

module.exports = {
  generateTurnsByDate,
  initTrun,
  prepareTurns,
};
