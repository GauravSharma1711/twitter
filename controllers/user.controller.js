import { Notification } from '../models/notification.model.js';
import User from '../models/user.model.js'

export const getUserProfile = async (req,res)=>{

    const {username} = req.params;

    
    try {
        const user = await User.findOne({username}).select('-password');
        if(!user){
            res.status(404).json({error:error.message})
        }

        res.status(200).json(user)

    
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("error in getUserProfile controller");
    }


}

export const getSuggestedUsers=async(req,res)=>{
try {
    const userId = req.user._id;
    const usersFolllowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
        {
            $match:{
                _id:{$ne:userId}
            }
        },
        {$sample:{size:10}}
    ])
    const filteredUsers =  users.filter(user=>!usersFolllowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,4);
    suggestedUsers.forEach(user=>user.password = null);
    return res.status(200).json(suggestedUsers);
} catch (error) {
    console.log("Error in suggested users",error.message);
    res.status(500).json({error:error.message})
}
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        const myId = req.user._id; // From authentication middleware
        const me = await User.findById(myId);

        // Convert myId to string for comparison
        if (userId === myId.toString()) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        if (!user || !me) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = me.following.includes(userId);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(myId, { $pull: { following: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { followers: myId } });

            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            // Follow
            await User.findByIdAndUpdate(myId, { $push: { following: userId } });
            await User.findByIdAndUpdate(userId, { $push: { followers: myId } });
            // send notification to user

            const newNotification = new Notification({
                type:"follow",
                   from:myId,
                   to:userId
            });

            await newNotification.save();

           


            return res.status(200).json({ message: "Followed successfully" });
        }
        
    } catch (error) {
        console.log("Error in follow/unfollow user controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const updateUser = async(req,res)=>{
    const {fullName,email,username,currentPassword,newPassword,bio,link}  =req.body
let {profileImg, coverImg} = req.body
    const userId = req.user._id;

   try {
    const user = await User.findById(userId);
     if(!user){
         return res.status(400).json({error:"log in first"})
     }

     if(currentPassword && newPassword){
        const isMatch = await bcrypt.compare(currentPassword,user.password);
        if(!isMatch){
           res.status(400).json({error:"Invalid password"});
        }
        if(newPassword.length<6){
            return res.status(400).json({error:"password must be atleast 6 character long"});
        }
     }

    //  if(profileImg){

    //  }
    //  if(coverImg){

    //  }


    user.fullName = fullName || user.fullName;
    user.email  =email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;


user =  await user.save();
user.password =  null;
    return res.status(200).json(user);



 
   } catch (error) {
    res.status(500).json({error:"Internal server errro"})
    console.log("error in updateuser controller")
   }


}