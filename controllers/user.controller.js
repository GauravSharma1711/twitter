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

export const getSuggestedUsers=()=>{

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
            
            return res.status(200).json({ message: "Followed successfully" });
        }
        
    } catch (error) {
        console.log("Error in follow/unfollow user controller:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const updateUserProfile = ()=>{
    
}