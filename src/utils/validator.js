import validator from "validator";

export const isEmail = (email) => {
  return validator.isEmail(email);
};

export const isDate = (date) => {
  return validator.isDate(date, {format: "YYYY-MM-DD"});
};
