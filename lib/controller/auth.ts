import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JwtPayload } from "jsonwebtoken";
import Groq from "groq-sdk";

const SECRET = process.env.SECRET_KEY!;

export async function getAuthUser() {
  const token = cookies().get("token")?.value;

  console.log("STEP 1 token:", token);
  console.log("STEP 2 secret:", SECRET);

  if (!token) {
    console.log("❌ TOKEN MISSING");
    return null;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("✅ STEP 3 decoded:", decoded);

    if (typeof decoded === "string") {
      console.log("❌ decoded is string");
      return null;
    }

    console.log("✅ STEP 4 userId:", decoded._id);
    return decoded as JwtPayload & { id: string };

  } catch (err: any) {
    console.log("❌ JWT VERIFY ERROR:", err.message);
      await cookies().delete("token")
      
  }
}
  
interface value{
    companyProposal:String,
         ClientProposal:String
}





export async function AIProposal(req:value){


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let Prompt = `
You are a senior Business Consultant and Professional Proposal Writer.

TASK:
You will receive two inputs:
1. COMPANY PROPOSAL – our company’s services, strengths, experience, and positioning
2. CLIENT REQUIREMENTS – client needs, goals, industry, and expectations

OBJECTIVE:
- Carefully read and understand both inputs
- Create a NEW, CUSTOMIZED, CLIENT-SPECIFIC BUSINESS PROPOSAL
- Do NOT copy content directly
- Rewrite everything clearly, professionally, and persuasively
- The proposal must sound human-written, business-ready, and client-focused

WRITING RULES:
- Write ONLY for the client
- Simple, clear, professional English
- No generic or AI-sounding phrases
- Focus on how OUR company solves CLIENT problems
- Confident, trustworthy, and consultancy tone

STRUCTURE (STRICTLY FOLLOW THIS ORDER):

Title Page  
(Project Name + Client Name)

Introduction & Understanding of Client Needs  
(2–3 professional paragraphs)

Our Company Overview  
(Short, relevant, credibility-focused)

Proposed Solution  
(Clearly mapped to client needs, paragraph + bullets)

Scope of Work  
(Bullet points only)

Deliverables  
(Bullet points only)

Timeline & Milestones  
(Clear phases or weeks)

Pricing / Commercials  
(If not provided, clearly mention: "To be discussed")

Why Choose Us  
(Bulleted unique advantages)

Terms & Conditions  
(Short, professional bullet points)

Closing Statement & Next Steps  
(Strong, confident closing paragraph)

FORMATTING INSTRUCTIONS (VERY IMPORTANT):
- Use clear section headings
- Leave ONE blank line between sections
- Leave ONE blank line between paragraphs
- Use proper bullet points (• or -)
- Do NOT compress text
- Output must look like a real business proposal
- DO NOT write everything in a single paragraph
- DO NOT remove spaces between words

INPUT:
---
COMPANY PROPOSAL:
${req.companyProposal}

CLIENT REQUIREMENTS:
${req.ClientProposal}
---

OUTPUT:
Generate a complete, cleanly formatted, client-ready Business Proposal.
and plzz give me this ready to use and date also feel persent date.
`;


async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0]?.message?.content || "";
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    model:"groq/compound-mini",
    messages: [
       {
            role: "system",
            content: "You are a professional proposal writer."
          },
      {
        role: "user",
        content:Prompt,
      },
    ],
   temperature:0.3
  });
}


let value=await main()
// console.log("ai proposal Ready to use",value)
function formatProposal(raw:any) {
  return raw
    // remove markdown headings & bold
    .replace(/#{2,3}\s*/g, "\n\n")
    .replace(/\*\*/g, "")

    // remove separators
    .replace(/---+/g, "\n\n")

    // fix missing spaces between words
    .replace(/([a-z])([A-Z])/g, "$1 $2")

    // normalize bullet points
    .replace(/\s*-\s*/g, "\n• ")

    // normalize pipes / tables (optional – keeps readable)
    .replace(/\|/g, " ")

    // normalize spaces
    .replace(/[ \t]{2,}/g, " ")

    // normalize line breaks
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}

return formatProposal(value)







}

