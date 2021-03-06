var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var randomstring=require('randomstring');
var JSAlert = require("js-alert");
//var popupS = require('popups');
var multer = require('multer');
var upload = multer();
app.use(upload.array());
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'main_admin';
app.use(express.static(__dirname+'/views'));
app.set('view engine','ejs');
let db;
MongoClient.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
    
});
app.get('/patient/appointment', function(req, res)  {
  db.collection("appointment_details").find().toArray().then(result=>res.render('appointment',{record:result}));
});

app.post('/patient/appointment', function(req, res){
    //var appointment_id=randomstring.generate(4);
    var patient_name = req.body.patient_name;
    var test_details = req.body.test_details;
    var date = req.body.date;
    var time = req.body.time;
    var query = {"patient_name":patient_name,"test_details":test_details,"date":date,"time":time};
    console.log(query);
    db.collection("appointment_details").insertOne(query,(err,res)=>{
        if (err)
            throw err;
        console.log("1 item inserted");
       
        //JSAlert.alert("This is an alert.");
   //     popupS.alert({
     //       content: 'Hello World!'
       // });
    }); 
    db.collection("appointment_details").find().toArray().then(result=>res.render('appointment',{record:result})); 
     
});

app.get('/patient/view_appointment',function(req,res){
  var patient_name = req.body.patient_name;
    db.collection("appointment_details").find({"patient_name":patient_name}).toArray().then(result => res.render('view_appointment',{record:result}));
  });
  app.post('/patient/view_appointment',function(req,res){
    var patient_name = req.body.patient_name;
    db.collection("appointment_details").find({"patient_name":patient_name}).toArray().then(result => res.render('view_appointment',{record:result}));
  });

app.listen(3000);