import { getAuthUser } from "@/lib/controller/auth";
import { Pdftextextract } from "@/lib/controller/user.controller";
import { dbConnection } from "@/lib/dbConnect";
import PDF from "@/lib/Models/AllDocx";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Make sure database is connected
    await dbConnection();

    // Get authenticated user
    const data = await getAuthUser(); 
    console.log("data",data)
    if (!data?._id) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    console.log("Database connected, fetching PDFs...");

    // Fetch all PDFs
    const userdata = await PDF.find({},"_id name").lean(); // lean() gives plain JS objects

    return NextResponse.json({ message: userdata }, { status: 200 });
  } catch (err) {
    console.error("Error in GET /UserData:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req:NextRequest){
      try{
       await  dbConnection()
   
      
       let value =await Pdftextextract(req)

       return NextResponse.json({message:value})


      }catch(err){
          return NextResponse.json({message:"Data does not found"})
      }
}