var mongoose=require("mongoose");

var imgsche=mongoose.Schema({
image:String,
});

var img=mongoose.model("img",imgsche);
module.exports=img;