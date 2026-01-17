import { createMoment, deleteMoment } from "../models/moment.model.js";

export const createMomentController = async (req, res) => {
  try {
    const { userId } = req;
    const image = req.file.path;
    const { caption } = req.body;
    console.log("image from create moment", image);
    console.log("caption from create moment", caption);
    console.log("type of caption", typeof caption);
    const moment = await createMoment(userId, image, caption);
    res.json(moment);
  } catch (e) {
    console.error("error from create moment", e);
    res.status(500).json({ message: "error from create moment" });
  }
};

export const deleteMomentController = async (req, res) => {
  try {
    const { id } = req.params;
    const moment = await deleteMoment(id);
    res.json(moment);
  } catch (e) {
    console.error("error from delete moment", e);
    res.status(500).json({ message: "error from delete moment" });
  }
};
