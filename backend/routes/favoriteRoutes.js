import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, FavoriteController.getMyFavorites);
router.get('/my', authenticate, FavoriteController.getMyFavorites);
router.post('/:clubId', authenticate, FavoriteController.addFavorite);
router.delete('/:clubId', authenticate, FavoriteController.removeFavorite);

export default router;

