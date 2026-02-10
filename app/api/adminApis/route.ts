import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mammoth from "mammoth";
import { getAuthUser } from "@/lib/controller/auth";
import AuthUser from "@/lib/Models/User";
import PDF from "@/lib/Models/AllDocx";
import { dbConnection } from "@/lib/dbConnect";
import { Pdftextextract } from "@/lib/controller/user.controller";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    

   await dbConnection()
  let file= await Pdftextextract(req)
    return NextResponse.json({
      success: true,
      file:file
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "File parse failed" }, { status: 500 });
  }
}
