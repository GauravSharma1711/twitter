import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware';
import { deleteNotification, getNotification,deleteOneNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/',protectedRoute,getNotification);
router.get('/delete',protectedRoute,deleteNotification);
router.get('/:id',protectedRoute,deleteOneNotification);

export default router