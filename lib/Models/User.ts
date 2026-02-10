import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Admin", "user"], default: "user", required: true },
    password: { type: String, required: true },

    
  },
  {
    timestamps: true,
    minimize: false, 
  }
);

const AuthUser = mongoose.models.User || mongoose.model("User", UserSchema);
export default AuthUser;
