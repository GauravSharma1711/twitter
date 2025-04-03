import express from 'express'
import {followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile} from '../controllers/user.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile/:username',protectedRoute,getUserProfile);
router.get('/suggestedUsers',protectedRoute,getSuggestedUsers);
router.post('/follow/:id',protectedRoute,followUnfollowUser);
router.post('/update',protectedRoute,updateUserProfile);


export default router