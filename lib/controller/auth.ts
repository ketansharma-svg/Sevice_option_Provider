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

let Prompt=`You are a professional Business Consultant and Proposal Writer.

TASK:
You will be given:
1. A COMPANY PROPOSAL (our company’s services, strengths, pricing style, tone)
2. A CLIENT PROPOSAL / REQUIREMENT (client needs, expectations, industry, goals)

Your job is to:
- Carefully READ and UNDERSTAND both documents
- Merge the company’s strengths with the client’s exact needs
- Create a NEW, CUSTOMIZED, CLIENT-READY BUSINESS PROPOSAL
- Do NOT copy-paste content directly
- Rewrite everything in a professional, persuasive, and client-focused way

IMPORTANT RULES:
- Proposal must be written ONLY for the client
- Use simple, clear, and professional English
- Highlight how OUR company solves CLIENT problems
- Keep the tone confident, trustworthy, and business-ready
- No generic content, no AI-like wording

STRUCTURE OF FINAL PROPOSAL:
1. Title Page (Project Name + Client Name)
2. Introduction & Understanding of Client Needs
3. Our Company Overview (short & relevant)
4. Proposed Solution (mapped exactly to client requirements)
5. Scope of Work (clear bullet points)
6. Deliverables
7. Timeline / Milestones
8. Pricing / Commercials (if info is available, otherwise say "To be discussed")
9. Why Choose Us (unique advantages)
10. Terms & Conditions (short & professional)
11. Closing Statement & Next Steps

FORMATTING:
- Use headings and subheadings
- Use bullet points where required
- Keep it professional and proposal-ready
- Output should be directly usable as a Business Proposal document

INPUT FORMAT YOU WILL RECEIVE:
---
COMPANY PROPOSAL:
<<< Paste company proposal text here >>>
 ${req.companyProposal}

CLIENT PROPOSAL / REQUIREMENTS:
<<< Paste client proposal text here >>>
 ${req.ClientProposal}
---

OUTPUT:
Generate a complete, polished, client-ready Business Proposal.
Please generate the proposal using real line breaks.
Do NOT use \n or \\n anywhere.
Each section should start on a new line.`


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
            content: "You are a professional proposal writer ."
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

