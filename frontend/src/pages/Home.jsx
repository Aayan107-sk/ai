import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { nav } from 'framer-motion/client';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.jpg";


const Home = () => {
  const { userData,serverURL,setUserData,getGeminiResponse} = useContext(userDataContext);
  const navigate=useNavigate();
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("");
  const [aiText,setAiText]=useState("");
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  
  const synth=window.speechSynthesis;
  
  const handleLogout= async () => {
    try {
      const result= axios.get(`${serverURL}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
      
    } catch (error) {
      setUserData(null)
      console.log(error);
      
      
    }
  }
  const startRecognition = () =>{
    try {
       recognitionRef.current?.start()
       setListening(true)

    } catch (error) {
      if(!error.message.includes("start")){
        console.log("recognition error",error);
        
      }
      
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    console.log(utterance);
    
    isSpeakingRef.current=true;
    utterance.lang="hi-IN"
    const voices=window.speechSynthesis.getVoices()
    const hindiVoice= voices.find(v=>v.lang==="hi-IN");
    if(hindiVoice){
      utterance.voice=hindiVoice;
    }
    utterance.onend=()=>{
      setAiText("")
       isSpeakingRef.current=false;
       startRecognition()
    }
    synth.speak(utterance);
  }

  const handleComand = async(data) => {
    const {type,userInput,response}=data
    if(type==="google_search"){
      const query=encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if(type==="youtube_search"||type==="youtube_play"){
      const query=encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if(type==="open_website"){
      const query=encodeURIComponent(userInput)
      window.open(`https://${query}`, '_blank');
    }
   
    if(type==="calculator_open"){
      
      window.open(`https://www.online-calculator.com/full-screen-calculator/`, '_blank');
    }
    if(type==="instagram_open"){
     window.open(`https://www.instagram.com/`, '_blank');

    }
     if(type==="facebook_open"){
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if(type === "weather-show"){
       window.open(`https://www.google.com/search?q=weather`, '_blank');

     }
  }

  useEffect(() => {
   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   const recognition = new SpeechRecognition();
   recognition.continuous = true;
   recognition.lang='en-US';

   recognitionRef.current=recognition
   const isRecognizingRef={current:false}

   const safeRecognition=()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      try {
        recognition.start()
       
        
      } catch (error) {
        if(error.name !=="InvalidStateError"){
          console.error("start error",error);
          
        }  
       }
     }
    }

    recognition.onstart=()=>{
      
      isRecognizingRef.current=true;
      setListening(true);
      
    }
      recognition.onend=()=>{
      
      isRecognizingRef.current=false;
      setListening(false);
      if(!isSpeakingRef.current){
        setTimeout(()=>{
          safeRecognition();
      },1000)
      }
      
    }

    recognition.onerror=(e)=>{
      console.warn("recgnition Error:",e.error);
      isRecognizingRef.current=false;
      setListening(false);
      if(e.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(()=>{
          safeRecognition()
        },1000)
      }
  
    }

   recognition.onresult = async (e) => {
     const lastResultIndex = e.results.length - 1;
     const transcript = e.results[lastResultIndex][0].transcript.trim();
     if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
     setAiText(null)
     setUserText(transcript)
      recognition.stop()
      isRecognizingRef.current=false;
      setListening(false)
      const data = await getGeminiResponse(transcript);
      speak(data.response);
      handleComand(data)
      setAiText(data.response)
      setUserText("")
     }
   };
   const fallback= setInterval(()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      safeRecognition();
    }
   },10000)
   safeRecognition();
   return ()=>{
    recognition.stop();
    setListening(false);
    isRecognizingRef.current=false;
    clearInterval(fallback )
   }
   
  },[]);

  return (
    <div className='w-full h-screen bg-linear-to-t from-[black] to-[#020229] flex justify-center items-center flex-col gap-4'>

      {/* 🔹 Logout Icon with Tooltip */}
      <div className='group absolute top-[20px] right-[70px]'>
        <IoMdLogOut className='text-4xl text-white font-extrabold cursor-pointer '
         onClick={handleLogout}
         
        />
        <span className='absolute right-1/2 translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap'>
          Logout
        </span>
      </div>

      {/* 🔹 Settings Icon with Tooltip */}
      <div className='group absolute top-[20px] right-[20px]'>
        <IoSettingsOutline className='text-4xl text-white font-extrabold cursor-pointer '
        onClick={()=>{navigate('/customize')}}
        />
        <span className='absolute right-1/2 translate-x-1/2 mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap'>
          Setting
        </span>
      </div>

      {/* 🔹 Assistant Image Card */}
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-2xl shadow-blue-700/50 border-4 border-blue-600">
        <img src={userData?.assistantImage} alt="" className='h-full object-center' />
      </div>

      {/* 🔹 Assistant Name */}
      <h1 className='text-3xl text-white'>
        I'm <span className='text-blue-600'>{userData?.assistantName}</span>
      </h1>
      {!aiText && <img src={userImg} alt="User" className='w-50' />}

      {aiText && <img src={aiImg} alt="User" className='w-50' />}

    </div>
  )
}

export default Home
