import User from '../models/user.model.js'
import{generateTokenAndSetCookie} from '../utils/generateToken.js'

export const signUp = async(req,res)=>{

  try {
    
    const {fullName,username,email,password} = req.body;
    if(!fullName ||!username || !email || !password){
        res.status(400).json({
            message:"All fields are required"
        })
    }

    if(password.length<6){
        return res.status(400).json({
            message:"password must be atleast 6 characters long"
        })
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400).json({message:"user already exits"});
    }

    const newUser  = new User({
        fullName,
        username,
        email,
        password
    })
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
         res.status(201).json({massage:"user created succesfully",newUser})
    }else{
         res.status(400).json({massage:"user not created"})
    }

  } catch (error) {
    console.log("Error in signup controller");
    
    return res.status(500).json({massage:"Internal server error"})
  }


    
}


export const login = async (req,res)=>{

    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"email and password is required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
const isPasswordCorrect = await bcrypt.compare(password,user?.password||"");

if(!isPasswordCorrect)return res.status(400).json("password is not correct")

generateTokenAndSetCookie(user._id,res);

return res.status(200).json({user,message:"user logged in successfully"});


    } catch (error) {
        console.log("Error in login controller");
    
        return res.status(500).json({massage:"Internal server error"})
    }
    


}

export const logout = async(req,res)=>{
    try {
        res.cookie("token","",{maxAge:0});
        return res.status(200).json("logged out successfully")
    } catch (error) {
        console.log("Error in logout controller");
    
        return res.status(500).json({massage:"Internal server error"})
    }
}

export const getMe = async(req,res)=>{
try {
    
    const user = await User.findById(req.user._id);

    if(!user){
        return res.status(400).json("user not logged in")
    }



} catch (error) {
    console.log("Error in getMe controller");
    
    return res.status(500).json({massage:"Internal server error"})
}
}