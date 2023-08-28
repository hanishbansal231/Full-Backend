const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
   email:{
    type:String,
    required:true,
   },
   otp:{
    type:Number,
    required:true,
   },
   createAt:{
    type: Date,
    default:Date.now(),
    expires: 5 * 60,
   }
});

async function sendVerifyEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verify Email From StudyNotion...",otpTemplate(otp));
        console.log('Email Send Successfully...',mailResponse);
    }catch(err){
        console.log("Error Occured While Sending Mail...",err);
        throw err;
    }
}
OTPSchema.pre("save",async function(next){
    await sendVerifyEmail(this.email,this.otp);
    next();
})
module.exports = mongoose.model("OTP", OTPSchema);