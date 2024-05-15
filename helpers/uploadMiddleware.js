import multer from 'multer';
import path from 'path';

const tempDir = path.resolve('tmp');
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: { filesize: 2048 },
});

const upload = multer({ storage: multerConfig });
export default upload;
