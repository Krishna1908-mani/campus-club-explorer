import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { SupabaseService } from '../services/supabaseService.js';

const router = Router();

router.post('/', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const folder = req.body.folder || 'clubs/logos';
    const result = await SupabaseService.uploadFile({
      folder,
      filename: req.file.originalname,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.publicUrl,
      path: result.path,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
