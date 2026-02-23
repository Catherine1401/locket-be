import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG and WebP images are allowed"), false);
    }
};

// Moment middleware: write to disk (multer needs path for Cloudinary upload)
const diskUpload = multer({
    dest: "uploads/",
    fileFilter,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

// Avatar middleware: keep in memory (upload from buffer)
const memoryUpload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

export const imageMiddleware = diskUpload.single("image");
export const avatarMiddleware = memoryUpload.single("image");
