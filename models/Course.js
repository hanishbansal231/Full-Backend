const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
    },
    courseDescription: {
        type: String,
        trim: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews",
            required: true,
        }
    ],
    price:{
        type:Number,
    },
    thumNail:{
        type:String,
    },
    tag:{
        type:String,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
    },
    studentEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
});

module.exports = mongoose.model("Course", courseSchema);