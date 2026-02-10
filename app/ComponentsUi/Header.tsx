"use client";
import axios from "axios";
import Link from "next/dist/client/link";
import React from "react";
import { useRouter } from "next/navigation";
export default function Header() {
  
let routing=useRouter()
async function handellogout(){
     
          try{
              let res=await axios.post("/api/logout",{})
              console.log("Logout Response",res.data);
              if(res.data){
routing.push("/Auth/Login")
              }
          }catch(err){
            console.log("Logout Error",err);
          } 
}




  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold text-black-600">SOp Provider</h1>
        <nav className="flex gap-6 text-gray-700">
          <a href="#" className="hover:text-indigo-600">Home</a>
          <a href="#" className="hover:text-indigo-600">Features</a>
          <a href="#" className="hover:text-indigo-600" onClick={handellogout}>Logout</a>
          
          

        </nav>
      </div>
    </header>
  );
}
