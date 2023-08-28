const Category = require("../models/Category");

exports.createCategory = async (req,res) =>{
    try{
        const {name,description} = req.body;
        if(!name || !description) return res.status(401).json({
            success: false,
            message: "All Field Are Required...",
        })
        const category = await Category.create({name,description});
        return res.status(200).json({
            success: true,
            data:category,
            message:`Seccessfully created the category...`,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:`Internal Issue...${err.message}`,
        });
    }
}

exports.getAllCategory = async (req,res) => {
    try{
        const getCategory = await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            data:getCategory,
            message:`Successfully Get All Data...`,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:`Internal Issue...${err.message}`,
        });
    }
}

exports.getPageDetails = async (req,res) => {
    try{
        const {categoryId} = req.body;
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        if(!selectedCategory) return res.status(500).json({
            success: false,
            message:`Data Not Found...`,
        });
        const differentCategory = await Category.findById({
            _id:{$ne:categoryId},
        }).populate("courses").exec();
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
            },
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message:`Internal Issue...${err.message}`,
        });
    }
} 