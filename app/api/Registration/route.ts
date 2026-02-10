import { NextResponse,NextRequest } from "next/server";
import { dbConnection } from "@/lib/dbConnect";
import { FormData } from "@/lib/controller/user.controller";

export async function POST(req:NextRequest){
      try{ 
        await dbConnection()
            if(!req)return NextResponse.json({message:"Data Doest Not Exisist"})
           

         console.log("data data",req)
        await FormData(req)
      return NextResponse.json({success:true})

      }catch(err){
        return NextResponse.json({Message:"This is an api error"})

      }
}
