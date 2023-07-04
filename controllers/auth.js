import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async(req,res,next)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body,  password:hash});
        await newUser.save();
        res.status(200).send('New User Created !!');

    }catch(err){
        next(err);
    }
}

export const signin = async(req,res,next)=>{
    try{
        const user = await User.findOne({name:req.body.name});
        if(!user) return next(createError(404, "User not found!"));

        const isCorrect = await bcrypt.compare(req.body.password,user.password);    
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

        const token = jwt.sign({id:user._id},process.env.JWT)

        const {password,...others} = user;
        
        res.cookie("access_token",token,{
            httpOnly:true
        }).status(200).json(others)

        console.log("signed in");
        
    }catch(err){
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: "User with email does not exist" });
      }
  
      const token = jwt.sign(
        { _id: user._id },
        process.env.RESET_PASSWORD_KEY,
        { expiresIn: '10m' }
      );
  
      user.resetLink = token;
      await user.save();

      res.json({ resetLink: `https://example.com/reset-password/${token}` });
    } catch (err) {
      next(err);
    }
  };
  
  export const resetPassword = async(req,res)=>{

    const{id,token} = req.params;
    const{password} = req.body;

    const user = await User.findOne({_id:id});
    if(!user){
        return res.status(400).json("user does not exit");
    }

    const secret = process.env.JWT + user.password;

    try{
        // const verify = jwt.verify(token,secret);
        const hash = await bcrypt.hash(password,10);

        await User.updateOne(
            {
                _id:id,
            },
            {
                $set:{
                    password:hash,
                },
            }
        );
        console.log("updated");
        res.json({status:"password updated"});
    }catch(err){
        console.log(err);
    }
  }
