// const {instance} = require('../config/razorpay');
// const User = require("../models/User");
// const Course = require("../models/Course");
// const mailSender = require("../utils/mailSender");
// const { default: mongoose } = require('mongoose');

// exports.capturePayment = async (req,res) => {
//     const {courseId} = req.body;
//     const userId = req.user.id;
//     if(!courseId) return res.status(403).json({
//         success: false,
//         message: `Please Provide a valid course Id`,
//     });
//     let course;
//     try{
//         course = await Course.findById(courseId);
//         if(!course) return res.status(403).json({
//             success: false,
//             message: `Could not find the course...`,
//         });
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(403).json({
//                 success: false,
//                 message: `Student is already enrolled...`,
//             });
//         }
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: `Internal Error...${err.message}`,
//         });
//     }
//     const amount = course.price;
//     const currency = 'INR';

//     const option = {
//         amount: amount * 100,
//         currency: currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course._id,
//             userId,
//         }
//     };
//     try{
//         const paymentResponse = await instance.orders.create(option);
//         console.log(paymentResponse);
//         return res.status(200).json({
//             success: true,
//             courseName:course.courseName,
//             courseDesciption:course.courseDescription,
//             thumbnail:course.thumNail,
//             orderId:paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         });
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: `Internal Error...${err.message}`,
//         });
//     }
// };

// exports.verifySignature = async (req,res) => {
//     const webhookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];
//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
//     if(signature === digest){
//         console.log("Payment is Authorised...");
//         const {courseId,userId} = req.body.payload.payment.entity.notes;
//         try{
//         const enrolledCourse = await Course.findOneAndUpdate(
//             {_id:courseId},
//             {
//                 $push:{
//                     studentEnrolled:userId,
//                 }
//             },{new:true}
//         );
//         if(!enrolledCourse){
//             return res.status(500).json({
//                 success: false,
//                 message: `Course not found...`,
//             });
//         }
//         console.log(enrolledCourse);
//         const enrolledStudent = await User.findOneAndUpdate(
//             {_id:userId},
//             {
//                 $push:{
//                     courses:courseId,
//                 }
//             },
//             {new:true}
//         )
//         console.log(enrolledStudent);
//         const emailResponse = await mailSender(
//             enrolledStudent.email,
//             "Congratulation from codeHelp...",
//             "Congratulation, You are onboarded into new course...",
//         );
//         console.log(emailResponse);
//         return res.status(200).json({
//             success: success,
//             message: `Signature Verified and course added...`,
//         });
//         }catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success: false,
//                 message: `Internal Error...${err.message}`,
//             });
//         }

//     }else{
//         return res.status(400).json({
//             success: false,
//             message: `Invalid Signature...`,
//         });
//     }
// }