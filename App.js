const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(function(req,res,next){
    res.removeHeader('x-powered-by');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();})

mongoose.connect("mongodb://localhost:27017/DairyDB");

const dairySchema = {
    title: "",
    content: ""
}
const Dairy = mongoose.model("Dairy",dairySchema);

app.get("/",(req,res)=>{
    Dairy.find((err,result)=>{
       res.send(result)
    })
})
app.post("/",(req,res)=>{
    const dairyData = new Dairy({
        title: req.body.title,
        content: req.body.content
    })
    dairyData.save((err)=>{
        if(!err){
            console.log("saved successfully")
        }else{
            console.log(err)
        }
    })
   
})

app.delete("/", (req,res)=>{
    const index = req.body.name;
     Dairy.find((err,result)=>{
         Dairy.findOneAndDelete({_id:result[index]._id},(err)=>{
             console.log("Successfully delete item");
         })
     })
})


app.listen(5000,function(){
    console.log("App is working on port 5000")
})
