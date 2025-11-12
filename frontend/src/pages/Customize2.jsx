import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {userData,backendImage,selectedImage,serverURL,setUserData}= useContext(userDataContext)
  const [assistantName,setassistantName]=useState(userData?.assistantName||"")
  const [loding,setLoding]=useState(false)
  const navigate=useNavigate()

  const hendleUpdateAssistant= async ()=>{
    setLoding(true)
      try {
        let formData=new FormData()
        formData.append("assistantName",assistantName)
        if(backendImage){
          formData.append("assistantImage",backendImage)
        }else{
          formData.append("imageUrl",selectedImage)
        }
        const result= await axios.post(`${serverURL}/api/user/update`,formData,{withCredentials:true})
        setLoding(false)
        console.log(result.data);
        setUserData(result.data)
        navigate("/")
        
      } catch (error) {
        console.log(error);
        setLoding(false)
        
      }
  }

  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#020229] flex justify-center items-center flex-col'>
      <MdKeyboardBackspace 
      className='absolute top-[30px]  left-[30px] text-white w-[25px]  h-[25px] font-extrabold cursor-pointer'
      onClick={()=>navigate("/customize")}
      
      />
      <h1 className="text-white font-bold text-4xl text-center mb-10">Enter Your <span className='text-blue-700'>Assistant Name</span></h1>
      <input
              type="text"
              value={assistantName}
              required
              className="w-full max-w-[30%] p-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:border-blue-500 outline-none transition-all text-white"
              placeholder="Eg. Nariobi"
              onChange={(e)=>setassistantName(e.target.value)}
            />
            {assistantName && <button className='text-2xl text-center bg-blue-600 text-white h-12 w-40 rounded-2xl mt-4  cursor-pointer hover:scale-105' disabled={loding} onClick={()=>{
              navigate("/")
              hendleUpdateAssistant()
              }}>{!loding?"Next":"Loding..."}</button>}
      
      
    </div>
  )
}

export default Customize2
