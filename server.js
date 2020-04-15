const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://Pranay:REDcherry%401@angulartest-wdzzt.gcp.mongodb.net/test?authSource=admin&replicaSet=Angulartest-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true";
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3000;
const app = express();
const delay = require('delay');
 var pass,email;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors({
  origin: ['https://mngoconnection.web.app/','https://mngoconnection.firebaseapp.com/'],
  credentials: true
}));

app.use(cookieParser());
app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  
  saveUninitialized: true,
  resave: true,
  // cookie: { maxAge: 3600000*6, secure: false,httpOnly: false }
}));
app.use(bodyParser.json());



const validatePayloadMiddleware = (req, res, next) => {
  if(req.body) {
    console.log("right");
    next();
  }else {
    console.log("wrong");
  }
}


let sess;
 global.checkuser;
 global.checkpass;
 app.get('/',function(req,res)
 {
    sess = req.session;
    if(sess.email) {
        console.log("userin");
        
    }
  // res.sendFile('index.html');
    res.send("Hello server");
 })


app.post('/login',validatePayloadMiddleware,function(req,res)
{
//   console.log(req.session.email);
//   if(req.session.email) {
//       console.log("userin");
//       res.json({
//         message: true,
//         pass1: "userin",
//         email1: sess.email

//       })
//   }
// // res.sendFile('index.html');
//   else {
    console.log("se1", session);
    console.log("id",req.sessionID);
    // sess = req.session;
    // console.log("session",sess);
    // console.log("session",sess.cookie.path);
    
    console.log("reqhead",req.headers);
    console.log("sessemail",req.session);
    console.log(req.cookies);
    console.log(req.body);
    console.log(req.body.email);
    console.log("reqhead1",req.headers);
    

   
    MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TestR");
    
    dbo.collection("user").findOne({email:req.body.email}, function(err, res) {
      if (err) throw err;
      console.log("res.email",res);
      
      if(res == null)
      {
        global.checkuser=false;
        global.checkpass=false;
        console.log('globalcheck',global.checkuser);
            }
            else
            {
              
              if(res.password == req.body.password){
                global.checkpass=true;
                global.checkuser=true;
                pass = res.password;
                email = res.email;
              }
              else {
                pass = res.password;
                email = res.email;
                global.checkuser=true;
                global.checkpass=false;
              }
              
              console.log('globalcheck',global.checkuser);
              console.log('globalpass',global.checkpass);
            }

            


          db.close();


      });
      
});


  setTimeout(() => {
    console.log("check global",global.checkuser)

    if(global.checkuser==false ){
    res.json({
      message:false,
      pass1: "nopass",
      email1: "noemail"

    })
  }
  else if(global.checkpass== false && global.checkuser==true){
    res.json({
      message:false,
      pass1: "wrongpass",
      email1: email
    })
  }
  else{
      req.session.email = req.body.email;
      req.session.save();
    res.json({
      message:true,
      pass1: pass,
      email1: email
    })
  }

    // if(global.checkuser==false ){
    //   res.json({
    //     message:false,
    //     pass1: "nopass",
    //     email1: "noemail"

    //   })
    // }

    // else{
    //   req.session.email = req.body.email;
    //   req.session.save();
    //   res.json({
    //     message:true,
    //     pass1: pass,
    //     email1: email
    //   })
    // }
  },1000 )
  
  
});

app.get('/dashboard',(req,res) => {
  // sess = req.session;
  console.log(req.session);
  console.log("reqhead",req.headers);
  console.log("id",req.sessionID);
  console.log(req.cookies);
  if(req.session.email) {
      // console.log("sess",sess.cookie.email);
      res.json({"email1": req.session.email, "user" : true });
  }
  else {
    res.json({"email1": "no email", "user" : false });
  }
});

app.get('/logout',(req,res) => {
  console.log("logout");
  req.session.destroy((err) => {
    console.log("logout");
      if(err) {
          return console.log(err);
          
      }
      // res.redirect('/');
  });

});

app.get('/output',function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TestR");
    dbo.collection("OnlineCompiler").findOne({email:"a@gmail.com"}, function(err, res) {
      if (err) throw err;
      console.log(res);
      global.res1 = res.output
      console.log(global.res1)
      global.count1=1;

      db.close();
    });

  });
  (async () => {

    await delay(3000);
  
    // Executed 100 milliseconds later
    console.log("check global",global.res1)
    res.json({
      message:global.res1
    })
  
  })();
  
})
 app.post('/setcode',function(req,res){
var email = req.body.email;
console.log(req.body.email)

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  // Insert document in TestR
  var dbo = db.db("TestR");
  var myobj = { code:req.body.email,email:"a@gmail.com"};

    dbo.collection("output").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
  
});
res.status(200).send({"message":"Data recieved"})
 });



 app.listen(PORT,function()
 {
     console.log("sunn raha hu ")
 });
 
