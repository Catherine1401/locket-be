import { cloudinary } from "../config/clouldinary.js";

// Upload moment image from file path
export const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    return result;
  } catch (e) {
    console.error("error from uploadImage", e);
    throw e;
  }
};

// Upload avatar from buffer (memory storage) with avatar-specific transformations
export const uploadAvatarBuffer = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
        transformation: [
          {
            width: 200,
            height: 200,
            crop: "fill",
            gravity: "face",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Delete image from Cloudinary by public_id
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error("error from deleteImage", e);
  }
};

// Extract Cloudinary public_id from URL
export const extractPublicId = (url) => {
  if (!url) return null;
  // Match: /upload/v123/avatars/abc123.jpg → avatars/abc123
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  return match ? match[1] : null;
};

export const getThumbnail = (id) => {
  try {
    return cloudinary.url(id, {
      width: 123,
      height: 123,
      crop: "fit",
      quality: "auto",
      fetch_format: "auto",
    });
  } catch (e) {
    console.error("error from getThumbnail", e);
  }
};

export const getImageUrl = (id) => {
  try {
    return cloudinary.url(id);
  } catch (e) {
    console.error("error from getImageUrl", e);
  }
};
