var mongoose=require("mongoose");

var comsche=mongoose.Schema({
comment:String,
author:String

});

var com=mongoose.model("com",comsche);
module.exports=com;