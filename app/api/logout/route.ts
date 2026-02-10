    import { NextRequest, NextResponse } from "next/server";
    import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
        try{
        
            (await cookies()).delete("token");
            return NextResponse.json({message:"Logout Successful"})
        }catch(err){
            return NextResponse.json({message:"Logout Api Error"})
        }
    }