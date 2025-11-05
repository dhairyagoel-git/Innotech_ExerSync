const express = require("express");
const router = express.Router();
const Profile = require("../models/profile");
const protect = require("../middleware/authMiddleware"); // ✅ import middleware


router.post("/update-profile" , async(req,res)=>{
    try{

        const {profile} = req.body
        if(!profile) 
          return res.status(400).json({message : "Profile missing"});
        const user = await Profile.findOne({email : profile.email})
        if(!user)
          return res.status(400).json({message : "invalid profile"});
        user.coins = profile.coins
        user.xp = profile.xp
        user.workouts = profile.xp
        await user.save()
        res.status(200).json({message : "Profile updated successfully"})
    } catch (err){
        res.status(500).json({message : `Your backend error : ${err.message}`})
    }

});
module.exports = router;