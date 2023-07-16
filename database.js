const mysql = require("mysql2");

const { dbHost, dbUser, dbPass, dbName } = require("./env");
const { Err } = require("./error");

const { handleDate, prepareAllDateFormats } = require("./moment");

const pool = mysql
  .createPool({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName,
  })
  .promise();

const getTurnsByDate = async (requestedDate, currentDate) => {
  try {
    const mDate = handleDate(requestedDate, currentDate);
    const sqlDate = mDate.enDate;

    const [dbTurns] = await pool.query(
      `
        SELECT
        *
        FROM turns
        WHERE DATE(date) = DATE(?)
        ORDER BY date ASC
        `,
      [sqlDate]
    );
    const result = {
      date: mDate,
      turns: dbTurns.map((item) => ({
        ...item,
        date: handleDate(item.date).faFullDate,
      })),
    };
    return result;
  } catch (error) {
    throw new Err(400, error.sqlMessage);
  }
};

const createTurns = async ({ refname, refphone, user, description, date }) => {
  try {
    const sqlDate = handleDate(date).enFullDate;
    const items = [refname, refphone, user, description, sqlDate];
    const [result] = await pool.query(
      `
    INSERT INTO turns (refname, refphone, user, description, date)
    VALUES ?
    `,
      [[items]]
    );
    return result;
  } catch (error) {
    const dupMsg = "خطای ثبت نوبت تکراری";
    const msg = error.code === "ER_DUP_ENTRY" ? dupMsg : error.sqlMessage;
    throw new Err(400, msg);
  }
};

const editTurn = async ({ id, refname, refphone, description, date, user }) => {
  try {
    const sqlDate = handleDate(date).enFullDate;
    const [result] = await pool.query(
      `
    UPDATE turns
    SET refname = ?, refphone = ?, description = ?, date = ?, user = ?
    WHERE id = ?
    `,
      [refname, refphone, description, sqlDate, user, id]
    );
    return result;
  } catch (error) {
    throw new Err(400, error.sqlMessage);
  }
};

const deleteTurn = async (id) => {
  try {
    const [result] = await pool.query(
      `
    DELETE FROM turns
    WHERE id = ?
    `,
      [id]
    );
    if (!result.affectedRows) {
      throw { code: 404, message: "آیتم مورد نظر یافت نشد" };
    }
    return result;
  } catch (error) {
    throw new Err(error.code || 400, error.sqlMessage || error.message);
  }
};

// const login = async ({ userNumber }) => {
//   try {
//     const [rows] = await pool.query(
//       `
//           SELECT *
//           FROM operators
//           WHERE id = ?
//           `,
//       [userNumber]
//     );
//     if (!rows[0]) {
//       throw new Error("اجازه ورود داده نشد!");
//     }
//     return { ...rows[0], message: `${rows[0].name} عزیز خوش آمدید` };
//   } catch (error) {
//     return new Err(400, error.sqlMessage || error.message);
//   }
// };

// const getTurnById = async (id) => {
//   try {
//     const [rows] = await pool.query(
//       `
//         SELECT *
//         FROM appointments
//         WHERE id = ?
//         `,
//       [id]
//     );
//     return rows[0];
//   } catch (error) {
//     return new Err(400, error.sqlMessage);
//   }
// };

// const getTurnsByRange = async (startDate, endDate) => {
//   try {
//     const [rows] = await pool.query(
//       `
//       SELECT *
//       FROM appointments
//       WHERE DATE(date) BETWEEN DATE(?) AND DATE(?)
//       `,
//       [startDate, endDate]
//     );
//     return rows;
//   } catch (error) {
//     return new Err(400, error.sqlMessage);
//   }
// };

module.exports = {
  getTurnsByDate,
  createTurns,
  editTurn,
  deleteTurn,
};
