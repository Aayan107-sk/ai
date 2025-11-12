import React, { useContext, useRef, useState } from 'react';
import Card from '../components/Card';
import image1 from "../assets/image.png"
import image2 from "../assets/image1.jpg"
import image3 from "../assets/image2.jpg"
import image4 from "../assets/image3.jpg"
import { RiImageAddLine } from "react-icons/ri";
import  { userDataContext } from '../context/UserContext';
import { input } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";




const Customize = () => {
  const {
    serverURL,userData,setUserData,frontendImage,setFrontendImage,
    backendImage,setBackendImage,selectedImage,setSelectedImage
  }=useContext(userDataContext)
  const navigate=useNavigate()
  const inputImage=useRef()

  const handleImage=(e)=>{
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#020229] flex justify-center items-center flex-col'>
      <MdKeyboardBackspace 
            className='absolute top-[30px]  left-[30px] text-white w-[25px]  h-[25px] font-extrabold cursor-pointer'
            onClick={()=>navigate("/")
            }/>

      <h1 className="text-white font-bold text-4xl text-center mb-10"> Select Your <span className='text-blue-700'>Assistant Image</span></h1>
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-2">
      <Card image={image1}/>
      <Card image={image2}/>
      <Card image={image3}/>
      <Card image={image4}/>
      <div className={`w-[150px] h-[250px] bg-[#000022] border-2 border-[#9d9dec] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-3 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-3 border-white shadow-blue-900 ":null}`} onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
        }}>
        {!frontendImage && <RiImageAddLine className='text-white w-10 h-10'/> }   
        {frontendImage && <img src={frontendImage}/>}
      </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} className='h-full  object-cover' />
      </div>
      {selectedImage && <button className='text-2xl text-center bg-blue-600 text-white h-12 w-40 rounded-2xl mt-4  cursor-pointer hover:scale-105' onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  )
}

export default Customize
