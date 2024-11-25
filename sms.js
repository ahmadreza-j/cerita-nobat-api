const axios = require("axios");
const {
  smsNumber,
  smsPatternCodeComment,
  smsPatternCodeTurn,
  smsApiKey,
} = require("./env");

const sendSubmitTurnInfoSms = (fullDate, number) => {
  const dateArray = fullDate.split(" ");
  const date = dateArray[0].replace(/-/g, "/");
  const hour = dateArray[1];
  sendSms("turn", number, { date, hour });
};

const sendCommentSms = async (number) => {
  const commentLink = "https://b2n.ir/y54587";
  return sendSms("comment", number, { commentLink });
};

const sendSms = (type, toNum = "", input = {}) => {
  if (!smsApiKey || !smsNumber) return;

  return axios
    .post(
      "https://api2.ippanel.com/api/v1/sms/pattern/normal/send",
      {
        sender: smsNumber,
        recipient: toNum,
        code: getPatternCode(type),
        variable: input,
      },
      {
        headers: {
          "Content-Type": "application/json",
          apikey: smsApiKey,
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        return response.data
      } else {
        console.log("Unexpected response:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error occurred:", error.response?.data || error.message);
    });
};

const getPatternCode = (type) => {
  if (type === "turn") return smsPatternCodeTurn;

  if (type === "comment") return smsPatternCodeComment;

  return "";
};

module.exports = {
  sendSubmitTurnInfoSms,
  sendCommentSms
};
