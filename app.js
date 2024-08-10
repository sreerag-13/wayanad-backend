const cors=require("cors")
const express=require("express")
const bcrypt=require("bcrypt")
const mongoose=require("mongoose")
const adminModel = require("./models/admin")
const app=express()
const jwt=require("jsonwebtoken")
const peopleModel = require("./models/peoples")
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
            
            jwt.sign({username:input.username},"rescue-app",{expiresIn:"1d"},
                (error,token)=>{
                    if (error) {
                        res.json({"status":"Token Creation Failed"})

                    } else {
                        res.json({"status":"success","token":token})

                    }
                })
        } else {
            res.json({"status":"invalid password"})
        }
    } else {
        res.json({"status":"invalid username"})
        
    }
      
        
    }).catch()
    
})
app.post("/peopleadd",(req,res)=>{
    let input =req.body
    console.log(input)
    let token=req.headers.token
    console.log(token)
    jwt.verify(token,"rescue-app",(error,decoded)=>{
        if(decoded && decoded.username)
        {
            let result=new peopleModel(input)
            result.save()
            res.json({"status":"success"})

        }else
        {
            res.json({"status":"Invalid Authentication"}) 
        }
    }) 
})
app.post("/viewall",(req,res)=>{
    let token =req.headers.token
    console.log(token)
    jwt.verify(token,"rescue-app",(error,decoded)=>{
        if (decoded && decoded.username) {
            peopleModel.find().then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":"error"})
                }
            )
            
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

/*app.post("/viewall",(req,res)=>{
    let token = req.headers.token
    console.log(token)
    jwt.verify(token, "rescue-app", (error, decoded) => {
        if (error) {
            res.json({"status": "Invalid Authentication"})
        } else if (decoded && decoded.username) {
            peopleModel.find().then(
                (items) => {
                    res.json(items)
                }
            ).catch(
                (error) => {
                    res.json({"status": "error"})
                }
            )
        } else {
            res.json({"status": "Invalid Authentication"})
        }
    })
}) */
app.listen(8080,()=>{
    console.log("server start")
})