import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const tempDir = path.resolve('tmp');
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },

  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extName);
    const suffix = crypto.randomUUID();
    cb(null, `${baseName}-${suffix}${extName}`);
  },

  limits: { filesize: 2048 },
});

const upload = multer({ storage: multerConfig });
export default upload;
