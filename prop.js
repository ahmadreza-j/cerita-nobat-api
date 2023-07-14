const lexicon = (key) => {
  const stack = {
    doctorName: "دکتر",
    operatorName: "کاربر",
    date: "تاریخ",
    time: "زمان",
    refname: "نام",
    refphone: "تلفن",
    description: "توضیح",
    isBatch: "گروهی",
  };
  return stack[key] || key;
};
const prop = (key, value) => ({ key: lexicon(key), value });

const generateProps = (object = {}, propList = []) => {
  return propList.map((key) => prop(key, object[key]));
};

module.exports = {
  prop,
  generateProps,
};
