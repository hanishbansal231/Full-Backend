const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {imploadImageToCloudinary} = require("../utils/imageUploader");
exports.createSubSection = async (req,res) =>{
    try{
        const {title,timeDuration,description,sectionId} = req.body;
        const vedioPath = req.files.vedio;
        if(!title || !timeDuration || !description || !vedioPath || !sectionId) return res.status(402).json({
            success: false,
            message: "All Field Are Required...",
          });
          const uploadDetails = await imploadImageToCloudinary(vedioPath,process.env.FOLDER_NAME);
          const subSectionDetails = await SubSection.create({title,timeDuration,description,vedioUrl:uploadDetails.secure_url});
          const updateSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push:{
                    subSection:subSectionDetails._id
                }
            },
            {new:true}
          ).populate("subSection").exec();
          return res.status(200).json({
            success: true,
            data:updateSection,
            message: `Successfully Created Subsection`,
          })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Error...${err.message}`,
        });
    }
}

//Update SubSection
exports.updateSubSection = async (req,res) => {
    try{
        const {title,timeDuration,description,subSectionId} = req.body;
        if(!title || !timeDuration || !description || !vedioPath || !sectionId) return res.status(402).json({
            success: false,
            message: "All Field Are Required...",
          });
          const updateDetails = await SubSection.findByIdAndUpdate(
            {subSectionId},
            {title,timeDuration,description,subSectionId},
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
            message: `Internal Error...${err.message}`,
        });
    }
}
//Delete SubSection

exports.deleteSubSection = async (req,res) => {
    try{
        const subSectionId = req.params;
        if(!subSectionId) return res.status(402).json({
            success: false,
            message: "All Field Are Required...",
          });
       const deleteDetails = await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success: true,
            data: deleteDetails,
            message: `Successfully Update Section...`,
          });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal Error...${err.message}`,
        });
    }
}