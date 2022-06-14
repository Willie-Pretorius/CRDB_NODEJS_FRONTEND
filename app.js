const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const csv = require("csvtojson");


today = new Date()
year= today.getFullYear()


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

let datalist = [{ number: "Checked number", id: "Provider ID" }];
let NumberingPlan = []
let carrier = ""

mongoose.connect("mongodb://127.0.0.1:27017/numbers_db");
const numberSchema = new mongoose.Schema({
  id: String,
  number: String,
});
const Numbers = mongoose.model("numbers_col", numberSchema, "numbers_col");

async function load_numbering_plan () {
  NumberingPlan = await csv().fromFile("data/NumberingPlan.csv")
  
}
// load_numbering_plan().then(()=>console.log(NumberingPlan))
const loadcsv = load_numbering_plan()

async function number_plan_checker(str){
  formatted = replaceAll(str,"27","0")
  return new Promise((resolve)=>{
    number= Number(formatted)
    NumberingPlan.forEach((prefix)=>{
      ifrom = Number(prefix.NumberFrom);
      ito = Number(prefix.NumberTo);
      if (number >= ifrom && number <= ito ){
        result = prefix['PARTICIPANT_ID']
        carrier = result;
        resolve();
      }
    })
    
  })
}

function retrieve_data(info) {
  return new Promise((resolve) => {
    Numbers.findOne(info, (err, file) => {
      if (err) {
        // console.log("err");
      } else {
        if (file == null) {
          number_plan_checker(info.number);
          console.log()
          datalist.push({
            number: info.number,
            id: carrier,
          });
          resolve();
        } else {
          datalist.push({
            number: info.number,
            id: file.id,
          });
          resolve();
        }
      }
    });
  });
}

async function post_handler(list) {
  for (item of list) {
    if (item != "Invalid"){
      await retrieve_data({ number: item });
    } else datalist.push({number:"invalid",id: "invalid"})
    
  }
}

app.get("/", (req, res) => {
  datalist = [{ number: "Checked number", id: "Provider ID" }];
  res.render("list", {
    array: [{ number: "Checked number", id: "Provider ID" }],date:year
  });
});

app.get("/query", (req, res) => {
  // console.log(datalist);
  res.render("list", { array: datalist,date:year });
  datalist = [{ number: "Checked number", id: "Provider ID" }];
});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function format_input(input){
  a = replaceAll(input," ", "")
  list = a.split(",")
  let numbers = []
  list.forEach(number=>{
    c = number.replace(/[^0-9 ]/g, "")
    if (c[0] == 0){
      c = "27"+c.substring(1)
    }
    if (c.length > 11 || c.length <11){
      numbers.push("Invalid" )
    } else {
      numbers.push(c)
    }
  })
  // console.log(numbers)
  return numbers
}



app.post("/query", async (req, res) => {
  input = req.body.number;
  numbers = format_input(input)
  if (numbers.length > 100) {
    datalist = [{ number: "The maximum lookups are 100 at a time.", id: "" }];
    res.redirect("/query");
  } else {
    const result = await post_handler(numbers);
    res.redirect("/query");
  }
});

//"27319144531"
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
