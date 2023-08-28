const Section = require('../models/Section');
const Course = require('../models/Course');
  // ->Create Section 
exports.createSection = async (req,res) => {
  try{
    const {sectionName,courseId} = req.body;
    if(!sectionName || !courseId) return res.status(402).json({
      success: false,
      message: "All Field Are Required...",
    });
    const newSection = await Section.create({sectionName});
    const updateCourseDetails = await Course.findByIdAndUpdate(
      {_id:courseId},
      {
        $push:{
          courseContent:newSection._id,
        }
      },
      {new:true}
    ).populate("courseContent").exec();
    return res.status(200).json({
      success: true,
      data: updateCourseDetails,
      message: `Successfully Created Section...`,
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Internal Error ${err.message}`,
    });
  }
}
 //  ->Update Section
 exports.updateSection = async (req,res) => {
  try{
    const {sectionName,sectionId} = req.body;
    if(!sectionName || !sectionId) return res.status(402).json({
      success: false,
      message: "All Field Are Required...",
    });
    const updateDetails = await Section.findByIdAndUpdate(
      {_id:sectionId},
      {
        sectionName,
      },
      {new:true}
    );
    return res.status(200).json({
      success: true,
      data: updateDetails,
      message: `Successfully Update Section...`,
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Internal Error ${err.message}`,
    });
  }
 }
//   ->Delete Section

exports.deleteSection = async (req,res) =>{
  try{
    const {sectionId,courseId} = req.body;
    if(!sectionId || !courseId) return res.status(402).json({
      success: false,
      message: "All Field Are Required...",
    });
    await Course.findByIdAndDelete(
      {_id:courseId},
      {
        $push:{
          courseContent:sectionId,
        }
      },{new:true}
    ) 
    const deleted = await Section.findByIdAndDelete(sectionId);
     return res.status(200).json({
      success: true,
      data: deleted,
      message: `Successfully Deleted Section...`,
    });
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Internal Error ${err.message}`,
    });
  }
}