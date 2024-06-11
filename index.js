const mongoose = require("mongoose");
const ejs = require("ejs");

const express = require("express");
const app = express();

const mongoDBConnectionString = "mongodb+srv://SE12:CSH2024@myatlasclusteredu.rtgjgdd.mongodb.net/cshLoanerSite?retryWrites=true&w=majority&appName=myAtlasClusterEDU";

mongoose.connect(mongoDBConnectionString)
.then(() => console.log("MongoDB connection successful."))
.catch((err) => console.error("MongoDB Connection error: ", err));

app.use(express.static(__dirname + "/public"));
app.use(express.json())
app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const loanerSchema = new mongoose.Schema(
  {
    // loanee: {type: mongoose.Schema.Types.ObjectId, ref: "Student"},
    loanee: {type: String},
    item: {type: String, required: true, unique: false},
    number: {type: Number, required: true, unique: false},
    isLoaned: {type: Boolean, required: true}
  }
)

const Loaner = mongoose.model("Loaner", loanerSchema)

const studentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  advisory: {type: String, required: true},
  room: {type: Number, required: true}
})

const Student = mongoose.model("Student", studentSchema)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
})

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
})

app.get("/loanerform", (req, res) => {
  res.sendFile(__dirname + "/public/loanerForm.html")
})

app.get("/termsofservice", (req, res) => {
  res.sendFile(__dirname + "/public/tos.html")
})

app.get("/loan", (req, res) => {
  Loaner.find({})
  .then((loaner) => {
    res.status(200).render("loaner.ejs", {loaner: loaner})
  })
})

app.post("/loan", (req, res) => {
  const loaner = new Loaner ({
    loanee: req.body.loanee,
    item: req.body.item,
    number: req.body.number,
    isLoaned: req.body.isLoaned
  })

  loaner.save()
  .then((newLoaner) => {
    res.status(200).json(newLoaner)
  })
  .catch((err)=>{
    console.error("Error:  ", err)
    res.status(404).send(err)
  })
})

app.get("/admin", (req, res) => {
  Student.find({})
  .then((borrower) => {
    res.status(200).render("admin.ejs", {student: borrower})
  })
  .catch((err)=>{
    console.error("Error:  ", err)
    res.status(404).send(err)
  })
})

//post route
app.post("/admin", (req, res) => {
  const student = new Student ({
    name: req.body.name,
    email: req.body.email,
    advisory: req.body.advisory,
    room: req.body.room
  });

  student.save()
  .then((student) => {
    res.status(200).json(student)
  })
  .catch((err)=>{
    console.error("Error:  ", err)
    res.status(404).send(err)
  })
})

app.patch("/loan", (req, res) => {
  const filter = {isLoaned: req.body.isLoaned}
  const update = {$set: {isloaned: true}}

  Item.findOneAndUpdate(filter, update, {new: true})
     .then((updatedItem) => {
       res.json(updatedItem)
     })
  .catch((err)=>{
    console.error("Error:  ", err)
    res.status(404).send(err)
  })
})

// app.patch("/loan", (req, res) => {
  
// })

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

app.listen(3000, () => {
  console.log(`Server running.`);
});

app.use((req,res,next)=>{
  res.sendFile(__dirname + "/public/404.html")
})


