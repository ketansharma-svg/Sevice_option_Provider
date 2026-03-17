import { dbConnection } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  PageOrientation,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
   PageNumber,
} from "docx";
import path from "path";
import { Packer } from "docx";
import fs from "fs"
import { getAuthUser } from "@/lib/controller/auth";
import AuthUser from "@/lib/Models/User";
import UserPDF from "@/lib/Models/UserPDF";
import { Main } from "next/document";
import companylogo from "../../assets/w3era-logo.jpg"
export async function GET() {
  try {

    
    await dbConnection();

    const value = await getAuthUser();
    if (!value) return NextResponse.json({ status: 400, error: "User Not Found" });

    const AUth = await AuthUser.findById(value._id);
    if (!AUth?.UserRoleIDs) return NextResponse.json({ status: 400, error: "User Role IDs missing" });

    const Maindata = await UserPDF.findById(AUth.UserRoleIDs.toString());
    if (!Maindata?.textContent) return NextResponse.json({ status: 400, error: "PDF content not found" });

   let lines=Maindata.textContent.split("\n").filter(Boolean)
   console.log("line by line ",lines)
   let title1 =lines[0]||"Project"
   let clientLine=lines.filter((l:any) => l.startsWith("For [Client Name]"))
   let PreparedBy=lines.find((l:any)=>l.startsWith("Prepared by"))
   let Date=lines.filter((l:any)=>l.startsWith("Date:"))

   console.log("alg alg aagya na text " ,title1 ,clientLine,PreparedBy,Date)
let sections: any[] = [];
let currentSection: any = null;

for (let line of lines) {
  // Agar numbered heading hai
  if (/^\d+\./.test(line)) {
    // Pehle wala section save karo
    if (currentSection) {
      sections.push(currentSection);
    }

    // Naya section start karo
    currentSection = {
      heading: line,
      content: ""
    };
  } 
  // Agar normal content line hai
  else if (currentSection) {
    currentSection.content += line + "\n";
  }
}

// Last section push karna mat bhoolna
if (currentSection) {
  sections.push(currentSection);
}
    const docs = await generateProposal({
      title1:title1,
      client: clientLine,
      date: Date,
      sections: sections
    });

    if (!docs) return NextResponse.json({ message: "PDF Generator Failed" });

    const buffer = await Packer.toBuffer(docs);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=MyProposal.docx",
      },
    });

  } catch (err) {
    console.error("PDF GET error:", err);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}







export async function generateProposal(data: any) {

  const logoPath = path.join(process.cwd(), "app", "assets", "w3era-logo.jpg");
  const logo = fs.readFileSync(logoPath);

  const doc = new Document({
    sections: [
      {
        properties: {
          titlePage: true,
            page: {
    margin: {
      top: 720,
      bottom: 720,
      left: 600,
      right: 600
    }
  }
        },

        headers: {

          // FIRST PAGE HEADER
          first: new Header({
            children: [
              new Table({

                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE
                },

                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
                },

                rows: [
                  new TableRow({
                    children: [

                      // LOGO
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
                        },

                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                              new ImageRun({
                                data: logo,
                                transformation: {
                                  width: 140,
                                  height: 70
                                },
                                type: "jpg"
                              })
                            ]
                          })
                        ]
                      }),

                      // DATE
                      new TableCell({
                        borders: {
                          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
                        },

                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: new Date().toLocaleDateString(),
                                size: 22
                              })
                            ]
                          })
                        ]
                      })

                    ]
                  })
                ]
              })
            ]
          }),

          // OTHER PAGES HEADER
          default: new Header({
            children: []
          })
        },

        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun("Page "),
                  PageNumber.CURRENT
                ]
              })
            ]
          })
        },

        children: [

          // TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: data.title || "Project Proposal",
                bold: true,
                size: 48
              })
            ]
          }),

          // CLIENT
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Client: ${data.client}`,
                size: 26
              })
            ]
          }),

          // PREPARED BY
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Prepared By: ${data.preparedBy}`,
                size: 26
              })
            ]
          }),

          // DATE
          new Paragraph({
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Date: ${data.date}`,
                size: 26
              })
            ]
          }),

          // SECTIONS
          ...data.sections.flatMap((section: any) => [

            new Paragraph({
              spacing: { before: 300, after: 150 },
              children: [
                new TextRun({
                  text: section.heading,
                  bold: true,
                  size: 32
                })
              ]
            }),

            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 250 },
              children: [
                new TextRun({
                  text: section.content,
                  size: 24
                })
              ]
            })

          ])

        ]
      }
    ]
  });

  return doc;
}