import {
  createMoment,
  deleteMomentByIdAndUserId,
} from "../models/moment.model.js";

export const createMomentController = async (req, res) => {
  try {
    const { userId } = req;
    const image = req.file.path;
    const { caption } = req.body;
    console.log("image from create moment", image);
    const moment = await createMoment(userId, image, caption);
    console.log("moment from create moment", moment);

    const momentResponse = {
      id: moment.id,
      imageUrl: moment.image_url,
      caption: moment.caption,
      userId: moment.user_id,
      createdAt: moment.created_at,
    };
    res.json(momentResponse);
  } catch (e) {
    console.error("error from create moment", e);
    res.status(500).json({ message: "error from create moment" });
  }
};

export const deleteMomentController = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  try {
    const moment = await deleteMomentByIdAndUserId(id, userId);

    if (!moment)
      return res
        .status(404)
        .json({ message: "moment not found or not your moment" });

    console.log("moment from delete moment", moment);
    res.json({ message: "moment deleted" });
  } catch (e) {
    console.error("error from delete moment", e);
    res.status(500).json({ message: "error from delete moment" });
  }
};
