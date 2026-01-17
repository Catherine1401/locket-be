import { getMoment } from "../models/moment.model.js";

export const isMyMoment = async (req, res, next) => {
  const userId = req.userId;
  console.log("userId", userId);
  const { id } = req.params;
  console.log("id", id);

  const moment = await getMoment({ id });
  if (!moment) return res.status(404).json({ message: "moment not found" });

  if (moment.user_id !== userId)
    return res.status(403).json({ message: "not your moment" });
  next();
};
