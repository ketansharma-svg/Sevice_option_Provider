import mongoose from "mongoose";


let userpdf=new mongoose.Schema({
  name:{type:String,
    required:"false"
  },
  textContent:{
     type:String,
     required:true
  },
  BranchId:{
    type:String,
    required:true
  }



}
,
{
    timestamps:true,
    minimize:false
}
)

let UserPDF=mongoose.models.UserPDF||mongoose.model("UserPDF",userpdf)

export default UserPDF