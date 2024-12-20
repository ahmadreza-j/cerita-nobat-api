const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "production"}` });

const port = process.env.PORT;
const dbHost = process.env.MYSQL_HOST;
const dbUser = process.env.MYSQL_USER;
const dbPass = process.env.MYSQL_PASSWORD;
const dbName = process.env.MYSQL_DATABASE;
const authVerify = process.env.AUTH_VERIFY;
const env = process.env.NODE_ENV;
const smsApiKey = process.env.SMS_API_KEY;
const smsNumber = process.env.SMS_NUMBER;
const smsPatternCodeTurn = process.env.SMS_PATTERN_CODE_TURN;
const smsPatternCodeComment = process.env.SMS_PATTERN_CODE_COMMENT;

module.exports = {
  port,
  dbHost,
  dbUser,
  dbPass,
  dbName,
  authVerify,
  env,
  smsApiKey,
  smsNumber,
  smsPatternCodeTurn,
  smsPatternCodeComment,
};
