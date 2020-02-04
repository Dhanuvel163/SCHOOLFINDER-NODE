var mongoose=require("mongoose");
var passportLocalMon=require("passport-local-mongoose");

var usersche=new mongoose.Schema({
    username:String,
    password:String

});

usersche.plugin(passportLocalMon);
var user=mongoose.model("user",usersche);
module.exports=user;