import multer from "multer";
const upload = multer({ dest: "uploads/" });

export const imageMiddleware = upload.single("image");
