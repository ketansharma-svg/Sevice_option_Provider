

"use client";

import Image from "next/image";
import sopImage from "@/public/SOPs-Header.webp";
import {
  Select, 
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SOPSection() {
  const [data, setData] = useState<{ _id: string; name: string }[]>([]);
  const [selectedId, setSelectedID] = useState<string>("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [genratedisabled,setDisabled]=useState(true)
  // 🔹 select change
  function handleSelect(id: string) {
    setSelectedID(id);
  }

  // 🔹 fetch select data
  async function Getdata() {
    try {
      const res = await axios.get("/api/UserData");

      console.log("get User Data",res)
      setData(res.data.message);
    } catch (err) {
      console.log("Fetch error", err);
    }
  }

  useEffect(() => {
    Getdata();
  }, []);

  // 🔹 submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedId || !pdf) {
      alert("Select option & PDF both required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", pdf);
      formData.append("userId", selectedId);

      const res = await axios.post("/api/UserData", formData);
      console.log("Upload success", res.data);
  
      alert("PDF uploaded successfully"); 
 setDisabled(false)
 
    } catch (err) {
      console.log("Upload error", err);
    } finally {
      setLoading(false);
    }
  }

async function genratepdf(){
         try{
            let value=await axios.get("api/pdfGenrate",{
    responseType: "blob", // 👈 very important
  });
            console.log("response Pdf genration ",value.data)


            const blob = new Blob([value.data], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
            console.log("blob",blob)
            let url=URL.createObjectURL(blob)
            let link=document.createElement("a")
            link.href=url
            link.download="w3eraa Proposal.docx"
            document.body.appendChild(link)
            link.click()
            link.remove()

            URL.revokeObjectURL(url)
         }catch(err){
          console.log("errors in pdf genration", err)
         }
        console.log("chl gya n ")
}


  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
   
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Streamline Your Processes with SOP
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Our Standard Operating Procedures (SOPs) ensure consistency, efficiency,
          and quality across your organization. Understand, implement, and achieve
          operational excellence.
        </p>


        <div className="mb-12">
          <Image
            src={sopImage}
            alt="Standard Operating Procedure"
            className="mx-auto rounded-lg shadow-lg"
            width={800}
            height={400}
            priority
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-award"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Standard</h3>
            <p className="text-gray-500">
              Establish clear guidelines that maintain consistency and quality across all operations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-cogs"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Operating</h3>
            <p className="text-gray-500">
              Streamline your processes with precise instructions to enhance productivity.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
            <div className="text-blue-600 text-4xl mb-4">
              <i className="fas fa-project-diagram"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Procedure</h3>
            <p className="text-gray-500">
              Follow structured procedures to ensure compliance and operational excellence.
            </p>
          </div>
        </div>

        {/* ====== PDF Upload Form ====== */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-md mx-auto bg-white p-8 rounded-xl shadow"
        >
          {/* 🔹 SELECT */}
          <Select onValueChange={handleSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {data.length > 0 ? (
                data.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500">No data found</div>
              )}
            </SelectContent>
          </Select>

          {/* 🔹 PDF INPUT */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
          />

          {/* 🔹 SUBMIT */}
          <button
            type="submit"
            disabled={!selectedId || !pdf || loading}
            className={`px-4 py-2 rounded text-white ${
              !selectedId || !pdf
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Uploading..." : "Submit PDF"}
          </button>



        </form>
        <button className={`bg-blue-700 text-white px-2.5 py-1.5 rounded-sm hover:bg-blue-800 ${genratedisabled && "cursor-not-allowed" }`} onClick={genratepdf} disabled={genratedisabled}>
           Genrate Docx.
        </button>
      </div>
    </section>
  );
}