const express = require("express");
const router = express.Router();
const {createCourse,getAllCourses,getCourseDetails} = require("../controllers/Course");
const {createSection,updateSection,deleteSection} = require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection");
const {createRating,getAverageRating,getAllRating} = require("../controllers/RatingAndReview");
const {createCategory,getAllCategory,getPageDetails} = require("../controllers/Category");
const {auth,isStudent,isAdmin,isInstructor} = require("../middlewares/auth");

router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/getCourseDetails",getCourseDetails);
router.post("/createSection",createSection);
router.post("/createSubSection",createSubSection);
router.post("/createRating",createRating);
router.post("/createCategory",auth,isAdmin,createCategory);
router.post("/getPageDetails",getPageDetails);


router.get("/getAllCourses",getAllCourses);
router.get("/getAllCategory",getAllCategory);
router.get("/getAverageRating",getAverageRating);
router.get("/getAllRating",getAllRating);


router.put("/updateSection",updateSection);
router.put("/updateSubSection",updateSubSection);


router.delete("/deleteCourse",deleteSubSection);
router.delete("/deleteSection",deleteSection);

module.exports = router;