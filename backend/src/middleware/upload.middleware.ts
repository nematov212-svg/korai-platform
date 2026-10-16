import multer from 'multer';
import { ApiError } from '../utils/errors.js';
import { config } from '../config/index.js';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Faqat JPEG, PNG yoki WebP formatidagi rasmlar qabul qilinadi. Yuklangan: ${file.mimetype}`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: config.storage.maxFileSizeMb * 1024 * 1024,
    files: 5, // Max 5 images per session
  },
  fileFilter,
});
