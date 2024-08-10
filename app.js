const cors=require("cors")
const express=require("express")
const bcrypt=require("bcrypt")
const mongoose=require("mongoose")
const adminModel = require("./models/admin")
const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://sreerag:sreerag@cluster0.onuj57g.mongodb.net/wayanadrescuedb?retryWrites=true&w=majority&appName=Cluster0")
app.post("/test",(req,res)=>{
res.json({"status":"done"})

})
app.post("/adminsignup",(req,res)=>
{
let input=req.body
let hashpassword=bcrypt.hashSync(input.password,10)
input.password=hashpassword
    console.log(input)
    let result=new adminModel(input)
    result.save()
    res.json({"status":"success"})
})
app.post("/adminsignin",(req,res)=>{
    let input=req.body
    let result=adminModel.find({username:input.username}).then((response)=>
    {  if (response.length>0) {
        const val=bcrypt.compareSync(input.password,response[0].password)
        if (val) {
            res.json({"status":"success"})
        } else {
            res.json({"status":"invalid password"})
        }
    } else {
        res.json({"status":"invalid username"})
        
    }
      
        
    }).catch()
    
})
app.listen(8080,()=>{
    console.log("server start")
})