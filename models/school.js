var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/schools",{useNewUrlParser:true});
var img=require("./image");
var com=require("./comment");



var schlsche=mongoose.Schema({
author:{
        id:{type:mongoose.Schema.Types.ObjectId,
        ref:"user"},
        username:String,
       },
name:String,
description:String,
address:String,
contact:Number,
certification:String,
images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"img"
        }],
comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"com"

        }],
});


var schl=mongoose.model("schl",schlsche);

// var newscl=new schl({
//     name:"oxford",
//     description:"blah......................blah....................",
//     address:"oxford Montessori Matric Hr Sec School,Schencottai Road,Ilanji",
//     contact:9776963498,
//     certification:"ISO 2009",
// });

// newscl.save(function(err,scl){
//      console.log(scl);
// });

// var newimage=new img({image:""});
// newimage.save(function(err,img){
//     schl.findOne({name:"oxford"},function(err,scl){
//     scl.images.push(img);
//     scl.save(function(err,scl){
//         console.log(scl);
//     });
//     });
// });

// var newcom=new com({
//         author:"ram",
//         comment:"goooooooooooooood!",
// });

// newcom.save(function(err,com){
//         schl.findOne({name:"Bharath Montessori"},function(err,scl){
//                 scl.comments.push(com);
//                 scl.save();

//         });

// });

module.exports=schl;