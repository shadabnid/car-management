// src/app/api/products/multerConfig.js
import multer from 'multer';

const storage = multer.memoryStorage(); 
const upload = multer({ storage, limits: { files: 10 } });

export default upload;
