const express= require('express');
const router = express.Router();

// @route GET api/post/test
//desc tests post route
//access Public
router.get("/test",(req,res)=>res.json({msg:"Post Works"}));


module.exports=router;