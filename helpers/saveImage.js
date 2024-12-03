import path from 'path';
import multer from 'multer';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de tamaño de archivo a 10MB
    fileFilter: (req, file, cb) => {
        if (!file) {
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
});

export default upload;

