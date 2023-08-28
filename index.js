const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const userRoutes = require("./routes/User")
const courseRoutes = require("./routes/Course")
const paymentRoutes = require("./routes/Payments")
const profileRoutes = require("./routes/Profile")
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir:"/tmp",
    })
)
connectDB();
cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/profile",profileRoutes);

app.get("/",(req,res) => {
    return res.json({
        success: true,
        message: `Your server is up and running...`,
    })
})

app.listen(PORT,() =>{
    console.log(`Start Server http://localhost:${PORT}`);
})