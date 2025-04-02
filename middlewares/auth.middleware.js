import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const protectedRoute = async (req,res,next)=>{
  
     try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"cookie not found"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).json({message:"unauthorized invalid token"});
        }

        const user = await User.findById(decoded._id).select('-password');
req.user=user;
next();
     } catch (error) {
        console.log("Error in protect route middleware");
        return res.status(500).json({message:"Internal server error"});
        
     }

}