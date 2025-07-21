import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middlewares/multer.js';
import streamifier from 'streamifier';

const router = express.Router();

// Temporary in-memory storage (only for testing)
const uploadedImages = [];

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    // Store uploaded image info temporarily
    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
      uploadedAt: new Date(),
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET route to list all uploaded image URLs
router.get('/upload', (req, res) => {
  res.status(200).json(uploadedImages);
});

export default router;
