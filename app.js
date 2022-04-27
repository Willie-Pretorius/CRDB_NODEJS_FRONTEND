const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
today = new Date()
year= today.getFullYear()

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

let datalist = [{ number: "Checked number", id: "Provider ID" }];

mongoose.connect("mongodb://localhost:27017/numbers_db");
const numberSchema = new mongoose.Schema({
  id: String,
  number: String,
});
const Numbers = mongoose.model("numbers_col", numberSchema, "numbers_col");

function retrieve_data(info) {
  return new Promise((resolve) => {
    Numbers.findOne(info, (err, file) => {
      if (err) {
        // console.log("err");
      } else {
        // console.log(file.id);
        if (file == null) {
          datalist.push({
            number: info.number,
            id: "Not Found",
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
    await retrieve_data({ number: item });
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

app.post("/query", async (req, res) => {
  input = req.body.number;
  numbers = input.split(",");
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
