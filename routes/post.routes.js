import express from 'express'
import { commentOnPost, createPost, deletePost, likeUnlikePost,getLikedPost,getFollowingPosts,getuserPosts } from '../controllers/post.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/user/:username',protectedRoute,getuserPosts);
router.get('/following',protectedRoute,getFollowingPosts);
router.get('/all/:id',protectedRoute,getAllPosts);
router.get('/liked/:id',protectedRoute,getLikedPost)
router.get('/create',protectedRoute,createPost);
router.post('/like/:id',likeUnlikePost);
router.post('/comment/:id',commentOnPost);
router.get('/delte/:id',deletePost);


export default router