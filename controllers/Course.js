const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {imploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();
exports.createCourse = async (req,res) => {
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,category,tag} = req.body;
        const thumbnail = req.files.thumbnailImage;
        console.log(thumbnail);
        if(!courseName || !courseDescription || !whatYouWillLearn || !category || !price || !tag || !thumbnail) return res.status(403).json({
            success: false,
            message: "All Field Are Required...",
        });
        const userId = req.user.id;
        const instructorDetail = await User.findById(userId);
        if(!instructorDetail) return res.status(403).json({
            success: false,
            message: "Instructor Details Not Found...",
        });
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) return res.status(403).json({
            success: false,
            message: "Category Details Not Found...",
        });
        console.log("Yes THis is right code...");
        const thumbnailImage = await imploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        console.log("thumbnailImage -> ",thumbnailImage);
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetail,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            tag,
            thumNail:thumbnailImage.secure_url,
        });
        await User.findByIdAndUpdate(
            {_id: instructorDetail._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {
                    courses:newCourse._id
            },
            {new:true}
        )
        return res.status(500).json({
            success: true,
            data:newCourse,
            message: `Successfully Created New Course...`,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}

exports.getAllCourses = async (req,res) => {
    try{
      const Allcourses = await Course.find({},{
        courseName: true,
        price: true,
        thumNail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
    })
    .populate("instructor")
    .exec();
    return res.status(500).json({
        success: true,
        data:Allcourses,
        message: `Successfully Show Course...`,
    });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}

exports.getCourseDetails = async (req,res) => {
    try{
        const {courseId} = req.body;
        const courseDetails = await Course.find({_id:courseId}).populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails",
                },
                populate:{
                    path:"courses",
                }
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }
        return res.status(200).json({
            success:false,
            data:courseDetails,
            message:`Course Detaild fetched successfully...`,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}