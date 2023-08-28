const express = require("express");
const router  = express.Router();
const {updateProfile,deleteAccount,getAllUserDetails} = require("../controllers/Profile");
const {auth} = require("../middlewares/auth");
router.put("/updateProfile",auth,updateProfile);
router.delete("/deleteAccount",auth,deleteAccount);
router.get("/getAllUserDetails",auth,getAllUserDetails);

module.exports = router;