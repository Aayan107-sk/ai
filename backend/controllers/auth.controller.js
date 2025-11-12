import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp= async (req,res)=>{
  try {
    const {name,email,password}=req.body

    // check the user already exist
    const existEmail=await User.findOne({email})
    if(existEmail){
      return res.status(400).json(
        {
          message:"email already exist... file auth.controller"
        }
      )
    }

    // check the password length <6 than 
    if(password.length < 6) {
       return res.status(400).json(
        {
          message:"Password must be at least 6  characters.... file auth.controller"
        }
      ) 
    }

    //hash the password
    const hashedPassword= await bcrypt.hash(password,10)

    //create  a user on database 
    const user= await User.create({
      name,password:hashedPassword,email
    })
    const token= await genToken(user._id)
    // pass the token on cookie 
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:false
    })


    return res.status(201).json(user)
  } catch (error) {
     return res.status(500).json({message:`sign up error ${error}`})
  }
}

//login 

export const Login= async (req,res)=>{
  try {
    const {email,password}=req.body

    // check the user already exist
    const user=await User.findOne({email})
    if(!user){
      return res.status(400).json(
        {
          message:"email dose not  exist... file auth.controller"
        }
      )
    }

   const isMatch= await bcrypt.compare(password,user.password)
     if(!isMatch){
      return res.status(400).json(
        {
          message:"incorect password "
        }
      )
    }
   
    const token= await genToken(user._id)
    // pass the token on cookie 
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"strict",
      secure:false
    })


    return res.status(200).json(user)
  } catch (error) {
     return res.status(500).json({message:`login  error ${error}`})
  }
}

//logout 

export const logOut=async(req,res)=>{
  try {
    res.clearCookie("token")
     return res.status(200).json({message:"logout seccus fully"})
  } catch (error) {
     return res.status(500).json({message:`logout  error ${error}`})
  }
}