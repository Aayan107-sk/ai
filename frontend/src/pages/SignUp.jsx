"use client";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaRobot } from "react-icons/fa";
import { userDataContext } from "../context/UserContext.jsx";



const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name,setname]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loding,setLoding]=useState(false)


  const {serverURL,userData,setUserData}=useContext(userDataContext)

  const [err,setErr]=useState("")
  const handleSignUp=async (e)=>{
    e.preventDefault()
    setErr("")
    setLoding(true)
    try {
      let result=await axios.post(`${serverURL}/api/auth/signup`,{
        name,email,password
      },{withCredentials:true})
      setUserData(result.data)
      setLoding(false)
      navigate("/customize")
            
    } catch (error) {
      console.log(error);
      setUserData(null)
      setLoding(false)
      setErr(error.response.data.message)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black text-white font-sans relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3, y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-96 h-96 bg-blue-600/30 rounded-full blur-3xl top-10 left-10"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2, y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-96 h-96 bg-purple-600/30 rounded-full blur-3xl bottom-10 right-10"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <FaRobot className="text-5xl text-blue-500 mb-2 animate-pulse" />
          <h2 className="text-3xl font-bold text-center">AI Assistant Signup</h2>
          <p className="text-center text-gray-400 mt-1 text-sm">
            Let’s get to know each other, human.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              onChange={(e)=>setname(e.target.value)}
              value={name}
              required
              className="w-full p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:border-blue-500 outline-none transition-all text-white"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              required
              className="w-full p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:border-purple-500 outline-none transition-all text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
                required
                className="w-full p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:border-pink-500 outline-none transition-all text-white pr-10"
                placeholder="Create a strong password"
              />
              {/* 👁️ Icon - Only one instance */}
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 cursor-pointer text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>
          </div>
          {err.length>0 && <p className="text-red-600">
            *{err}
            </p>}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/30 transition-all"
            disabled={loding}
          >
           {loding?"Loding...":" Sign Up"}
          </motion.button>
        </form>

        {/* Message */}
      

        {/* Navigation Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
