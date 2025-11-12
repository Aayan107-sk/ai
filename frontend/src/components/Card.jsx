import React, { useContext } from 'react'
import  { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
   const {
      serverURL,userData,setUserData,frontendImage,setFrontendImage,
      backendImage,setBackendImage,selectedImage,setSelectedImage
    }=useContext(userDataContext)
  return (
    <div className={`w-[150px] h-[250px] bg-[#000022] border-2 border-[#9d9dec] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-3 hover:border-white ${selectedImage==image?"border-3 border-white shadow-blue-900 ":null} `} onClick={()=>{
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)

    }}>
      <img src={image} alt="image" className='h-full object-cover' /> 
    </div>
  )
}

export default Card
