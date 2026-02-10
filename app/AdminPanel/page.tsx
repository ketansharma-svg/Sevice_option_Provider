"use client";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !file) {
      alert("Project name aur Word document dono required hain");
      return;
    }

    // Only allow .docx files (Mammoth does NOT support .doc)
    if (!file.name.endsWith(".docx")) {
      alert("Sirf DOCX files allowed hain");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file); // MUST match 'file' in backend

    try {
      const res = await axios.post("/api/adminApis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

   
       if(res.data){
        toast("Successfully Applying")
       }
      setProjects([
        ...projects,
        { id: projects.length + 1, name, fileName: file.name },
      ]);
      setName("");
      setFile(null);
    } catch (err: any) {
      console.error("Error uploading project:", err);
      alert(
        err.response?.data?.error || "File upload failed. Check console for details."
      );
    }
  };

  return (
   <>
   <Toaster position="top-right" /> 
    <div className="min-h-screen bg-gray-50 p-10 mt-10">
 
  
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">Add Project</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Add Project
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">All Projects</h2>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects added yet</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">Project Name</th>
                  <th className="border p-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">{p.fileName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
   </>
  );
}
