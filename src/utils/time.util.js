import dayjs from "dayjs";

export const converToLocalTime = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
