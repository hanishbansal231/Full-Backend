const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req,res) =>{
    try{
        const userId = req.user.id;
        const {rating,review,courseId} = req.body;
        const courseDetails = await Course.findOne({_id:courseId,studentEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails) return res.status(403).json({
            success: false,
            message: `Student is not enrolled in the course...`,
        });
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed) return res.status(400).json({
            success: false,
            message: `Course is already reviewed by the user...`,
        });

        const ratingReview = await RatingAndReview.create({
            rating,review,course:courseId,user:userId,
        });
       await Course.findByIdAndUpdate({_id:courseId},
        {
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true});
        return res.status(200).json({
            success: true,
            message: `Rating and review created successfully...`,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}

exports.getAverageRating = async (req,res) => {
    try{
        const courseId = req.body.courseid;
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ]);
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        return res.status(200).json({
            success: true,
            averageRating:0,
            message: `Average Rating is 0, no ratings given till now...`,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}

exports.getAllRating = async(req,res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                               .sort({rating:"desc"})
                               .populate({
                                path:"user",
                                select:"firstName lastName email image...",
                               })
                               .populate({
                                path:"course",
                                select:"courseName",
                               }).exec();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Issues...${err.message}`,
        });
    }
}