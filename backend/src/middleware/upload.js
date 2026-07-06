import multer from "multer";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return cb(createError("Invalid file type. Only JPEG, PNG, and WebP images are allowed"));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize
  }
});

const handleUploadErrors = (middleware) => (req, res, next) => {
  middleware(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(createError("Image file size must not exceed 5MB"));
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return next(createError("Unexpected image field or too many files"));
      }
    }

    return next(error);
  });
};

export const uploadProviderProfileImage = handleUploadErrors(upload.single("image"));
export const uploadServiceImages = handleUploadErrors(upload.array("images", 5));
export { allowedImageTypes, maxFileSize };
