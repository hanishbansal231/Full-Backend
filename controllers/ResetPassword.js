const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//resetPasswordToken
exports.resetPasswordToken = async (req,res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({email:email});
        if(!user) return res.status(401).json({
            success: false,
            message: `Your Email Not Registered With Us...`,
        });
        const token = crypto.randomUUID();
        const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordToken:Date.now() + 5 * 60 * 1000,
            },{new:true}
        );
        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email,"Password Reset Link...",`Password Reset Link: ${url}`);
        return res.status(200).json({
            success:true,
            data: updateDetails,
            message: "Email Send Successfully please check email and change password...",
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Something went wrong...${err.message}`
        })
    }
}
//resetPassword
exports.resetPassword = async (req,res) =>{
    try{
        const {password,confirmPassword,token} = req.body;
        if(password !== confirmPassword) return res.status(401).json({
            success: false,
            message: `Password Not Matched...`,
        });
        const userDetails = await User.findOne({token:token});
        if(!userDetails) return res.status(401).json({
            success: false,
            message: `Token is invalid...`,
        }); 
        
         if(userDetails.resetPasswordExpire < Date.now()){
            return res.status(400).json({
                success: false,
                message: `Token is expired, please regenerate your token...`,
            });
         }
         const hashPassword = await bcrypt.hash(password,10);
         await User.findOneAndUpdate(
            {token:token},
            {
                password:hashPassword,
            },
            {new:true}
         );
         return res.status(200).json({
            success:true,
            message: "Password reset Successfully...",
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Something went wrong...${err.message}`
        })
    }
}