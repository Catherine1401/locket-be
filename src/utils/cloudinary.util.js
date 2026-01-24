import { cloudinary } from "../config/clouldinary.js";

export const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image);
    return result;
  } catch (e) {
    console.error("error from upload image", e);
  }
};

export const getThumbnail = (id) => {
  try {
    const result = cloudinary.url(id, {
      width: 123,
      height: 123,
      crop: "fit",
      quality: "auto",
      fetch_format: "auto",
    })
    return result;
  } catch (e) {
    console.error("error from get image", e);
  }
};

export const getImageUrl = (id) => {
  try {
    const result = cloudinary.url(id);
    return result;
  } catch (e) {
    console.error("error from get image", e);
  }
};
