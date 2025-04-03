import Notification from '../models/notification.model.js'

export const getNotification = async (req,res)=>{
                 
    try {
        
        const userId = req.user._id;

  const notifications = await Notification.find({to:userId}).sort({createdAt:-1})
  .populate({
    path:"from",
    select:"username profileImg"
  });

  await Notification.updateMany({to:userId},{read:true});

  res.status(200).json(notifications);


    } catch (error) {
        console.log("error in getnotigication controller")
        res.status(500).json({error:"internal server error"});
    }
}

export const deleteNotification = async (req,res)=>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId});
        res.status(200).json({message:"Notifications deleted"});
    } catch (error) {
        console.log("error in deletenotigication controller")
        res.status(500).json({error:"internal server error"});
    }
}

export const deleteOneNotification = async(req,res)=>{
    try {
        const userId = req.user._id;
        const notificationid =req.params.id;

        const notification = await Notification.findById(notificationid);
        if(notification.to.string !== userId.toString()){
            return res.status(403).json({error:"you are not allowed to delete this notification"});
        }
        await Notification.findByIdAndDelete(notificationid);
        return res.status(200).json({message:"notification deleted successfully"});
    } catch (error) {
        console.log("error in deleteOnenotigication controller")
        res.status(500).json({error:"internal server error"});
    }
}