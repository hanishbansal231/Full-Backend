const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenrator = require("otp-generator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();
//sendOTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const exitUser = await User.findOne({ email });
        if (exitUser) return res.status(401).json({ success: false, message: "User is already exist..." });
        let otp = otpGenrator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP -> ", otp);
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenrator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);
        res.status(200).json({
            success: true,
            message: "OTP successfully sended...",
            otp,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}
// SignUp
exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, comfirmPassword, contactNumber, accountType, otp } = req.body;
        if (!firstName || !lastName || !email || !password || !comfirmPassword || !otp) return res.status(403).json({
            success: false,
            message: "All Field Are Required...",
        });
        if (password !== comfirmPassword) return res.status(400).json({
            success: false,
            message: "Password and ComfirmPassword value doesn't matched,Please try again ...",
        });
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(401).json({ success: false, message: "User is already exist..." });
        const recentOTP = await OTP.findOne({ email }).sort({ createAt: -1 }).limit(1);
        console.log(recentOTP);
        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP Not Found...",
            });
        } else if (parseInt(otp) !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP...",
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contact: null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            contactNumber,
            accountType,
            additionalDetails: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        return res.status(200).json({
            success: true,
            message: "User is registered successfully...",
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `User can't be register.Please try again ${err.message}`,
        })
    }
}

//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(403).json({
            success: false,
            message: "All Field Are Required...",
        });
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) return res.status(403).json({
            success: false,
            message: "User is not registered...",
        });
        console.log(user);
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.SECRET_JWT, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("Token", token, options).status(200).json({
                success: true,
                date:user,
                message: "Successfully Logged in..."
            })
        }else{
            return res.status(402).json({
                success: false,
                message: `Password is incorrect...`,
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `${err.message}`,
        })
    }
}
//ChangePassword
exports.changePassword = async (req,res) => {
    try{
        const {password,newPassword,comfirmPassword} = req.body;
        if(!password || !newPassword || !comfirmPassword) return res.status(403).json({
            success: false,
            message: "All Field Are Required...",
        });
        await User.findOneAndUpdate(
            {password:password},
            {password:newPassword},
            {new:true},
        );
        return res.status(200).json({
            success:true,
            message:"Password Successfully Changed...",
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `${err.message}`,
        })
    }
}