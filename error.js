class Err {
  constructor(code = 500, message = "خطایی رخ داده است") {
    this.code = code;
    this.message = message;
  }
}

module.exports = {
  Err,
};
