import { dbConnection } from "../dbConnect";
import { NextRequest, NextResponse } from "next/server";
import AuthUser from "../Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import mammoth from "mammoth";
import PDF from "../Models/AllDocx";
import { AIProposal, getAuthUser } from "./auth";
import UserPDF from "../Models/UserPDF";
import mongoose from "mongoose";



export async function FormData(req: NextRequest) {
     try {


          let body = await req.json()
          if (!body) return NextResponse.json({ Message: "Data Not Found In Backend" }, { status: 401 })
          let passwords = await bcrypt.hash(body.password, 10)
          let UserregisterId = {
               name: body.name,
               email: body.email,
               password: passwords,
               role: body.role
          }


          let value = new AuthUser(UserregisterId)
          const savedProduct = await value.save()

          return NextResponse.json({ success: true, Product: savedProduct })

     } catch (err) {
          return NextResponse.json({ message: "Send TO The Backend Code Is Error" }, { status: 500 })
     }
}

export async function LoginAutherization(req: NextRequest) {
     try {

          console.log(req)

          let { email, password } = await req.json()
          let UserFound = await AuthUser.findOne({ email })
          if (!UserFound) return NextResponse.json({ message: "User Does Not Exisit" })
          let truepassword = await bcrypt.compare(password, UserFound.password)
          if (!truepassword) {
    return NextResponse.json({ msg: "Invalid password" }, { status: 401 });
  }

  let secret = process.env.SECRET_KEY;
  if(!secret) return NextResponse.json({message:"JWt Secret is not defained"})

    let tokens=jwt.sign({_id:UserFound._id,role:UserFound.role},secret,{expiresIn:"1h"})      
    
    
 let res =NextResponse.json({msg:"Login Successfully",User:UserFound.role}) 
 res.cookies.set("token",tokens,{
     httpOnly:true,
     path:"/",
     maxAge:60*60*24*7
 })
  return res
          
       

     }


     catch (error) {
          return NextResponse.json({ message: error, error: "Internal Server Error" })
     }
}

export async function Pdftextextract(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    console.log("formData",formData)
    const name = formData.get("name");
    const Branch=formData.get("userId")
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!file.name.endsWith(".docx")) {
      return { success: false, error: "Only DOCX allowed" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    const value = await getAuthUser();

    if (value?.role === "Admin") {
      const create = new PDF({
        name,
        textContent: text,
      });
      await create.save();
    }else{
         const create=new UserPDF({
           name:"User",
           textContent:text,
           BranchId:Branch

         })
         await create.save()
         if(!Branch|| typeof Branch!=="string")return NextResponse.json({message:Branch })
        let objectID=new mongoose.Types.ObjectId(Branch)

         let AdminPDfind=await (PDF as any).findById(objectID) 
        console.log("Admin pdf id data find hogya h ",AdminPDfind)
        if(!AdminPDfind) return NextResponse.json({message:"Branch do not find"})
        console.log("this value founds",AdminPDfind.textContent,text)
      let value={
         companyProposal:AdminPDfind.textContent,
         ClientProposal:text
        

      }
         let mainProposal= await AIProposal(value)


    }

    return { success: true, text };
  } catch (err) {
    console.error("DOCX extract error:", err);
    return { success: false, error: "Internal function error" };
  }
}


