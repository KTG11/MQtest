

var Express= require("express");
var Mongoclient= require("mongodb").MongoClient;
var cors= require("cors");
const multer=require("multer");

var app= Express();
app.use(cors());

var CONNECTION_STRING="mongodb+srv://ktgsrilanka:Sphere Cylinder@cluster11.vrqoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster11"











var  DATABASENAME="Cluster11";
var database;

app.listen(5038,()=>{
    Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
        database=client.db(DATABASENAME)
        console.log("Mongodb connection Successful");
    });
})

app.get(/login/,(request,response)=>{
    database.collection("MathQuest").find({}).toArray((error,documents)=>{
        response.send(result);
    });

    })

app.post('/login',multer().none),(request,response)=>{
    database.collection("MathQuest").count({},function(error,numOfDocs){
        database.collection("MathQuest").insertOne({
            _id:(numOfDocs+1).toString(),
            description:request.body.newNotes

        });
    })
}

