import { cloudinary } from "../config/clouldinary.js";

export const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image);
    return result;
  } catch (e) {
    console.error("error from upload image", e);
  }
};

export const getImage = async (id) => {
  try {
    const result = await cloudinary.api.resource(id);
    return result;
  } catch (e) {
    console.error("error from get image", e);
  }
};

