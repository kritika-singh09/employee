// import multer from 'multer';
// import path from 'path';

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images are allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// });

// export default upload;
import multer from 'multer';
import path from 'path';

// Store file in memory (Cloudinary, S3, etc.)
const storage = multer.memoryStorage();

// Allow resumes and images
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG, and WEBP files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
