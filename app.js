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

let datalist = [{ Number: "Number", id: "ID",Action: "Action", carrier:"Carrier" }];
let RoutingLabels = []
let NumberingPlan = []
let carrier = ""

async function load_numbering_plan () {
  NumberingPlan = await csv().fromFile("data/NumberingPlan.csv")
}
async function load_routing_labels() {
  RoutingLabels = await csv().fromFile("data/RoutingLabels.csv")
}
const loadfile1 = load_routing_labels()
const loadfile2 = load_numbering_plan()

mongoose.connect("mongodb://127.0.0.1:27017/numbers_db");
const numberSchema = new mongoose.Schema({
  id: String,
  number: String,
});

const Numbers = mongoose.model("numbers_col", numberSchema, "numbers_col");

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
async function routing_label_checker(str){
  return new Promise((resolve)=>{
    RoutingLabels.forEach((prefix)=>{
      RNORoute = prefix.RoutingLabel;
      // console.log(RNORoute)
      if (RNORoute == str){
        result = prefix.ParticipantID
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
          datalist.push({
            Number: info.number,
            carrier: carrier,
            Action: "Not ported",
            id:"",
          });
          resolve();
        } else {
          object= file.toObject();
          // console.log(object.Action)
          routing_label_checker(object.RNORoute).then(
            datalist.push({
              Number: object.number,
              id: object.id,
              Action: object.Action,
              carrier: carrier,
            })
          );
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
  datalist = [{ Number: "Number", id: "ID",Action: "Action", carrier:"Carrier" }];
  res.render("list", {
    array: [{ Number: "Number", id: "ID",Action: "Action", carrier:"Carrier" }],date:year
  });
});

app.get("/query", (req, res) => {
  res.render("list", { array: datalist,date:year });
  datalist = [{ Number: "Number", id: "ID",Action: "Action", carrier:"Carrier" }];
});

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function format_input(input){
  a = replaceAll(input," ", "")
  a = a.replace(/(\r\n|\n|\r)/gm, ",");
  list = a.split(",")
  let numbers = []
  list.forEach(number=>{
    c = number.replace(/[^0-9 ]/g, "")
    if (c[0] == 0){
      c = "27"+c.substring(1)
    }
    if (c.length != 0){
    if (c.length > 11 || c.length <11){
      numbers.push("Invalid" )
    }  else {
      numbers.push(c)
    }}
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
