"use client";
import { useState } from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
let routing=useRouter()
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
   console.log(email,password)
   try{
  
     const res = await axios.post("/api/loginAuth",{
    email,
    password
    });
console.log("response",res)
   
   if(res.data.User==="Admin"){
       routing.push("/AdminPanel")
   }else if(res.data.User==="user"){
              routing.push("/")
   }
  }catch(error){
      console.log("Login error page")
   }



    

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back 👋</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-sm text-red-500">
            {msg}
          </p>
        )}

        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{" "}

          <Link href={"/Auth/register"}>Register</Link>
          <span className="text-indigo-600 cursor-pointer">
            
          </span>
        </p>
      </div>
    </div>
  );
}
