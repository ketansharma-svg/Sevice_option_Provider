import mongoose from "mongoose"

type connectionObjct={
     isConnected?:number
}


let connect:connectionObjct = {}

export async  function dbConnection():Promise<void>{

   if(connect.isConnected){
     console.log("Already Connected")
     return
   }

  try{
  const DB=   await mongoose.connect(process.env.MOOGOOSE_URL||"",{})

  console.log("DB",DB)
  connect.isConnected=DB.connections[0].readyState
  console.log("DB CONNECTED Successfully")
  }catch(err){
  console.log("Data Base connection failed",err)
  process.exit(1)
  }


}
