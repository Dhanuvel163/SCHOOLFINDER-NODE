var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/schools",{useNewUrlParser:true});
var methover=require("method-override");
var passport=require("passport");
var passportLocal=require("passport-local");
var passportLocalMon=require("passport-local-mongoose");
var flash=require("connect-flash");



var img=require("./models/image");
var schl=require("./models/school");
var com=require("./models/comment");
var user=require("./models/user");

app.use(methover("_method"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());


app.use(require("express-session")({
    secret:"Virat is a class batsman",
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
    
});
// var camp=[{name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"bharath",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"},
// {name:"indo",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBEQbjM8Ch8U4fVNq97sSaynaU52bGuqRnV7-UMD7VPJqRblUS"}];


app.get("/",function(req,res){
schl.find({}).populate("images").exec(function(err,schs){
    if(err)
    {
        req.flash("error","schools not found");
        res.redirect("back");
    }
    // console.log(schs);
    res.render("home",{scl:schs,currentUser:req.user});

});
}); 



app.get("/newscl",isloggedin,function(req,res){ 
    res.render("newscl",);
    });

app.post("/newscl",isloggedin,function(req,res){
    var author={
        id:req.user._id,
        username:req.user.username,
    }; 
    var name1=req.body.name;
    var img1=req.body.filename;
    var schl1={
        author:author,
        name:req.body.name,
        description:req.body.description,
        address:req.body.address,
        contact:req.body.contact,
        certification:req.body.certification,
    };
    schl.create(schl1);
    res.redirect("/");
    });

app.get("/schools/:name",function(req,res){ 
    schl.find({name: req.params.name}).populate("images").populate("comments").exec(function(err,schs){
        if(err)
        {
            req.flash("error","school not found");
            res.redirect("back");
        }
        // console.log(schs);
            res.render("scl",{scl:schs,currentUser:req.user});
        });
        

    });
       
        
app.put("/comment/:name",isloggedin,function(req,res){
    // console.log(req.body.author);
    // console.log(req.body.comment);
schl.find({name:req.params.name},function(err,scl){
    // console.log(req.body.author);
    if(err)
    {
        req.flash("error","school not found");
        res.redirect("back");
    }
       var newcom=new com({
         author:req.user.username,
         comment:req.body.comment,
       });

     newcom.save(req.body.comments,function(err,com){
        if(err)
        {
            req.flash("error","comment not found");
            res.redirect("back");
        }
    //   console.log("com");
    //   console.log(com);
      scl[0].comments.push(com);
      scl[0].save();
     });
     req.flash("success","successfully added comment");
     res.redirect("/schools/"+scl[0].name); 
});
});

app.post("/addimg/:name",isloggedin,function(req,res){
    schl.find({name:req.params.name},function(err,scl){
        if(err)
        {
            req.flash("error","school not found");
            res.redirect("back");
        }
           var newimg=new img({
             image:req.body.image,
           });
    
         newimg.save(req.body.images,function(err,img){
            if(err)
            {
                req.flash("error","image cannot be saved not found");
                res.redirect("back");
            };
          scl[0].images.push(img);
          scl[0].save();
         });
         req.flash("success","successfully added image");
         res.redirect("/schools/"+scl[0].name); 
    }); 
});
// -----------------------------------------------------------------------------------------------------------------------

app.get("/edit/:id",checksclauth,function(req,res){

    schl.findById(req.params.id,function(err,scl){
        if(err)
        {
        req.flash("error","school not found");
        res.redirect("back");
        };

        res.render("editscl",{scl:scl});
    });
    
});

app.put("/edit/:id",checksclauth,function(req,res){

    schl.findByIdAndUpdate(req.params.id,req.body.scl,function(err,scl){
        if(err)
        {
        req.flash("error","cant edit school");
        res.redirect("back");
        };
        req.flash("success","successfully edited school");
        res.redirect("/");
    });
    
});

app.delete("/delete/:id",checksclauth,function(req,res){
schl.findByIdAndRemove(req.params.id,function(err,scl){
    if(err)
        {
        req.flash("error","cant delete school");
        res.redirect("back");
        };
        req.flash("success","successfully deleted school");
    res.redirect("/");
});

});

app.get("/comment/edit/:id",checkcomauth,function(req,res){
    res.render("editcom",{comid:req.params.id});
    });

app.put("/comment/edit/:id",checkcomauth,function(req,res){
com.findByIdAndUpdate(req.params.id,req.body.com,function(err,co){
    req.flash("success","successfully edited comment");
    res.redirect("/");});
});
app.delete("/comment/delete/:id",checkcomauth,function(req,res){
com.findByIdAndRemove(req.params.id,function(err,co){
    req.flash("success","successfully deleted comment");
    res.redirect("/");
});
});


// ----------------------------------------------------------------------------------------------------------------------

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            // console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
        });
    });
 });

app.get("/login",function(req,res){
    res.render("login");
});
app.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","you are logged out");
    res.redirect("/");
});

app.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/"}),function(req,res){});
app.listen(3000);



function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
     
        return next();
    }
    // console.log("aaaaaaaaaaaaaaaaaaaaaaaa..............................");
    req.flash("error","please login first");
    res.redirect("/login");
}

function checksclauth(req,res,next)
{
    if(req.isAuthenticated())
    {
    schl.findById(req.params.id,function(err,scl){
        if(scl.author.id.equals(req.user._id)){
            next();
        }
        else{
            req.flash("error","you are not authorized");
            res.redirect("back");
        }

    });
    }
    else
    {
        req.flash("error","please login first");
        res.redirect("back");
    }
}

function checkcomauth(req,res,next)
{
    if(req.isAuthenticated())
    {
    com.findById(req.params.id,function(err,comm){
        
        if(comm.author==req.user.username){
            next();
        }
        else{
            res.redirect("back");
            req.flash("error","you are not authorized");
        }

    });
    }
    else
    {
        res.redirect("back");
        req.flash("error","please login first");

    }
}

app.listen(3001);