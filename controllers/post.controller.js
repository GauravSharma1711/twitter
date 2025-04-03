import Post from '../models/post.model.js'
import User from '../models/user.model.js'
import Notification from '../models/notification.model.js'
 
export const createPost = async(req,res)=>{

    try {

        const {text} = req.body
        const {img} = req.body

        const userId = req.user._id.toSting();
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user does not exist"})
        }

        if(!text && !img){
            return res.status(400).json({error:"post must have img or text"})
        }

        if(img){
            //upload to cloudinary
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })

   await newPost.save();

   res.status(201).json(newPost);
        
    } catch (error) {
        console.log("error in create post controller")
        return res.status(500).json("Internal serrver error",error)
    }

}

export const likeUnlikePost = async(req,res)=>{

    const {id:postId} = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if(!post){
        return res.status(404).json({error:"post not found"});
    }

    if(post.likes.includes(userId)){
        //already like now unlike
await Post.updateOne({_id:postId},{$pull:{likes:userId}})
await User.updateOne({_id:userId},{$pull:{likes:postId}})
await post.save();
await res.status(200).json({message:"post unliked successfully"});
    }else{
         //not liked yet like now 
         post.likes.push(userId);
         await User.updateOne({_id:userId},{$push:{likedPost:postId}});
         await post.save();
         
         const notification = new Notification({
             from:userId,
             to:post.user,
             type:"like"
            })
            await notification.save();
            
            await res.status(200).json({message:"post liked successfully"});
        }
        

    




}

export const commentOnPost =async (req,res)=>{
try {

    const {text} = req.body;
const userId = req.user._id
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }
    if(!text){
        return res.status(404).json({error:"text not found"});
    }



   const comment = {user:userId,text};
   post.comments.push(comment);

    await post.save();

    return res.status(200).json({message:"commented successfully"});
    

} catch (error) {
    console.log("Error in comment post controller");
        return res.status(500).json({error:"Internal server error"});
}
}

export const deletePost = async(req,res)=>{

    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are not authorized to delete this post"});
        }

        if(post.img){
            //delete post from cloudinary
        }

        await Post.findByIdAndDelete(req.params.id);

        return res.status(200).json({message:"Post deleted successfully"});

    } catch (error) {
        console.log("Error in delete post controller");
        return res.status(500).json({error:"Internal server error"});
    }

}

export const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
                select:"-password"
        })

        if(posts.length===0){
            return res.status(200).json([]);
        }
return res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAll post controller");
        return res.status(500).json({error:"Internal server error"});
    }
}


export const getLikedPost = async(req,res)=>{
    const userId = req.params.id
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"user not found"});
        }

        const likedPost = await Post.find({_id:{$in:user.likedPosts}})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments",
            select:"-password"
        })
        return res.status(200).json(likedPost)
    } catch (error) {
        console.log("Error in getLiked post controller");
        return res.status(500).json({error:"Internal server error"})
    }
}

export const getFollowingPosts = async(req,res)=>{
    try {
         const userId = req.user._id;
         const user  = await user.findById(userId);
         if(!user){
            return res.status(404).json({error:"user not found"});
         }

         const following = user?.following;

         const feedPost = await Post.find({user:{$in:following}})
         .sort({createdAt:-1})
         .populate({
            path:"user",
            select:"-password",
         })
         .populate({
            path:"comments.user",
            select:"-password"
         })
return res.status(200).json(feedPost);

    } catch (error) {
        console.log("Error in getFollowingPosts controller")
        return res.status(500).json({error:"Internal server error"});
    }
}

export const getuserPosts = async (req,res)=>{
    try {
        const {username} = req.params;
        const user  = await User.find(username);
        if(!user){
            return res.status(404).json({error:"user not found"});
        }
        const posts = await Post.find({user:user._id}).sort({createdAt:-1})
        .populate({
path:"user",
select:"-password"
        })
        .populate({
            path:"comments.user",
          select:"-password"
        })

        return res.status(200).json(posts);


    } catch (error) {
        console.log("error in getuserPosts controller");
        res.status(500).json({error:"Internal server error"});
    }
}