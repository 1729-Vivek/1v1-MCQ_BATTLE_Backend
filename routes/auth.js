const express=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('../models/User')

const router=express.Router();

//Signup

router.post('/signup',async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        let user=await User.findOne({email})
        if(user) return res.status(400).json({msg:'User already Exists'})

        user=new User({username,email,password})
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();

        const payload={user:{id:user.id}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err;
            res.json({token})
        });
    }
    catch(err){
        res.status(500).send('Server Error')

    }
})

//Login 
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email})
        if(!user) return res.status(400).json({msg:'Invalid Credentials'})
        
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch) return res.status(400).json({msg:'Invalid Credentials'})

        const payload={user :{id :user.id}}
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'},(err,token)=>{
            if(err) throw err;
            res.json({token})

        })

    }
    catch(err){
        res.status(500).send('Server error')
    }
})

module.exports=router;