// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt  from "jsonwebtoken";
import { json } from "stream/consumers";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  


  if (!token) {
    return NextResponse.redirect(
      new URL("/Auth/Login", request.url)
    );
  }

  let id=jwt.decode(token)as{
   role: String,
   exp:number
  }||null
  let expirydate=id.exp*1000
  let currentTym= Date.now() 
  console.log("currentTym",currentTym)
if(expirydate < currentTym){
  console.log("idtoken role",id.role,expirydate)
  return NextResponse.redirect(new URL("/Auth/Login",request.url))
 
}





  return NextResponse.next();
}

export const config = {
  matcher: ["/AdminPanel/:path*","/"],
};
