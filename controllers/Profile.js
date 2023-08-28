const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req,res) => {
    try{
      console.log(".......Start");
        const {gender,dateOfBirth="",about="",contactNumber} = req.body;
        const userId = req.user.id;
        console.log("User -> ",userId);
        if(!gender || !contactNumber || !userId) return res.status(402).json({
            success: false,
            message: "All Field Are Required...",
          });
          const userDetails = await User.findById(userId);
          const profileId = userDetails.additionalDetails;
          const profileDetails = await Profile.findById(profileId);
          profileDetails.gender = gender;
          profileDetails.dateOfBirth = dateOfBirth;
          profileDetails.about = about;
          profileDetails.contactNumber = contactNumber;
          await profileDetails.save();
          return res.status(200).json({
            success: true,
            data:profileDetails,
            message:`Updated Profile...`,
          })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Error...${err.message}`,
        })
    }
}

exports.deleteAccount = async (req,res) =>{
    try{
        const id  = req.user.id;
        const userDetails = await User.findById(id);
        if(!userDetails) return res.status(402).json({
            success: false,
            message: "User Not Found...",
          });
          await Profile.findByIdAndDelete(
            {_id:userDetails.additionalDetails},
          )
          await User.findByIdAndDelete(
            {_id:id},
          )
          return res.status(200).json({
            success: true,
            message:`Successfully Account Deleted...`,
          })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Error...${err.message}`,
        });
    }
}

exports.getAllUserDetails = async (req,res) => {
  try{
    const id = req.user.id;
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    return res.status(200).json({
      success: true,
      data: userDetails,
      message: 'Successfully Find User...',
    });
   }catch(err){
    console.log(err);
    return res.status(500).json({
        success: false,
        message: `Internal Error...${err.message}`,
    });
  }
}