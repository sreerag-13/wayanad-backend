const mongoose=require("mongoose")
const peopleSchema=mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true},
    village:{type:String,required:true},
    place:{type:String,required:true},
    pincode:{type:String,required:true},
    house:{type:String,required:true},
    missingdate:{type:String,required:true},
    aadhar:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:String,required:true}

})
const peopleModel=mongoose.model("peopledata",peopleSchema)
module.exports=peopleModel