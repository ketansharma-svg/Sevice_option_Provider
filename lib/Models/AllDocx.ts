import mongoose from "mongoose";

const docxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  textContent: { type: String, required: true },
  }, {
  timestamps: true,
  minimize: false,
});

// Use a global variable to prevent overwriting in dev
declare global {
  // eslint-disable-next-line no-var
  var PDFModel: mongoose.Model<any> | undefined;
}

const PDF = global.PDFModel || mongoose.model("PDF", docxSchema);

if (process.env.NODE_ENV !== "production") global.PDFModel = PDF;

export default PDF;