const mysql = require("mysql2");
const moment = require("jalali-moment");

const { dbHost, dbUser, dbPass, dbName } = require("./env");
const { Err } = require("./error");

const { getDate, getTime, getTimeRange } = require("./moment");
const { generateTurnsByDate, initTrun, prepareTurns } = require("./turn");

const pool = mysql
  .createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
  })
  .promise();

const getWorkingTimeList = async () => {
  try {
    const [rows] = await pool.query(
      `
          SELECT * 
          FROM workingtimeranges
          `
    );
    return rows;
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

const login = async ({ userNumber }) => {
  try {
    const [rows] = await pool.query(
      `
          SELECT * 
          FROM operators
          WHERE id = ?
          `,
      [userNumber]
    );
    if (!rows[0]) {
      throw new Error("اجازه ورود داده نشد!");
    }
    return { ...rows[0], message: `${rows[0].name} عزیز خوش آمدید` };
  } catch (error) {
    return new Err(400, error.sqlMessage || error.message);
  }
};

const createTurns = async ({
  visitordr = 1,
  refname,
  refphone,
  turner = 1,
  description,
  dates,
}) => {
  try {
    const isBatch = dates.length > 1;
    const items = dates.map((date) => [
      visitordr,
      refname,
      refphone,
      turner,
      description,
      getDate(date).enFullDate,
      isBatch,
    ]);
    const [result] = await pool.query(
      `
    INSERT INTO appointments (visitordr, refname, refphone, turner, description, date, isBatch)
    VALUES ?
    `,
      [items]
    );
    return result;
  } catch (error) {
    const dupMsg = "خطای ثبت نوبت تکراری";
    const msg = error.code === "ER_DUP_ENTRY" ? dupMsg : error.sqlMessage;
    return new Err(400, msg);
  }
};

const getTurnById = async (id) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT * 
        FROM appointments
        WHERE id = ?
        `,
      [id]
    );
    return rows[0];
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

const getTurnsByDate = async (date) => {
  try {
    const mDate = getDate(date);
    const sDate = mDate.faDate;
    const enSDate = mDate.enDate;
    const workingTimeRanges = await getWorkingTimeList();
    let generatedTurns = [];
    workingTimeRanges.forEach((item) =>
      generatedTurns.push(
        ...generateTurnsByDate(
          sDate,
          item?.startTime,
          item?.endTime,
          item?.periodInMinute
        )
      )
    );
    const initiatedTurns = generatedTurns.map((item) => initTrun(item));

    const [dbTurns] = await pool.query(
      `
      SELECT
      appointments.id, appointments.refname, appointments.refphone, appointments.description, appointments.date, appointments.status, appointments.isBatch,
      doctors.name AS doctorName, 
      operators.name AS operatorName
      FROM appointments
      INNER JOIN doctors
        ON doctors.id = appointments.visitordr
      INNER JOIN operators
        ON operators.id = appointments.turner
      WHERE DATE(date) = DATE(?)
      `,
      [enSDate]
    );
    dbTurns.forEach((item) => {
      let dbTurnItemTime = getDate(item.date).time;
      let initiatedTurn = initTrun(getDate(item.date).faFulldate, item);
      let i = generatedTurns.findIndex(
        (el) => dbTurnItemTime === getDate(el).time
      );
      if (i !== -1) {
        initiatedTurns[i] = initiatedTurn;
      } else {
        initiatedTurns.push(initiatedTurn);
      }
    });

    return prepareTurns(mDate, initiatedTurns);
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

const getTurnsByRange = async (startDate, endDate) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT * 
      FROM appointments
      WHERE DATE(date) BETWEEN DATE(?) AND DATE(?)
      `,
      [startDate, endDate]
    );
    return rows;
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

const editTurn = async (
  id,
  { visitordr = 1, refname, refphone, turner = 1, description, date }
) => {
  try {
    const [result] = await pool.query(
      `
    UPDATE appointments 
    SET visitordr = ?, refname = ?, refphone = ?, turner = ?, description = ?, date = ?
    WHERE id = ?
    `,
      [visitordr, refname, refphone, turner, description, date, id]
    );
    return getTurnById(id);
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

const deleteTurn = async (id) => {
  try {
    const [result] = await pool.query(
      `
    DELETE FROM appointments
    WHERE id = ?
    `,
      [id]
    );
    return result;
  } catch (error) {
    return new Err(400, error.sqlMessage);
  }
};

module.exports = {
  login,
  getWorkingTimeList,
  createTurns,
  getTurnById,
  getTurnsByDate,
  getTurnsByRange,
  editTurn,
  deleteTurn,
};
