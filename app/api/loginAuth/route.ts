import { NextResponse,NextRequest } from "next/server";
import { dbConnection } from "@/lib/dbConnect";
import { LoginAutherization } from "@/lib/controller/user.controller";

 export async function POST(req:NextRequest) {
  try {
    await dbConnection();

    
    console.log("Login Data Fetched:", req);
     
    if(!req)return NextResponse.json({message:"data nhi ara"})
    return await LoginAutherization(req);

    
   
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
