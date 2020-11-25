var path = require("path");
var fs = require("fs");
var express = require("express");
var app = express();
// var tableData = require(".../db/db.json");

// port
let PORT = process.env.PORT || 3001

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// HTML routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
  
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
  
  // api routes
app.get("/api/notes", function(req, res) {
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    try {
      let db = JSON.parse(data);
      res.send(db);
    } catch (e) {
      let arr = [];
      let obj = JSON.parse('{' + data + '}');
      arr.push(obj);
      res.send(arr);
    }
  });
});
  
app.post("/api/notes", function(req, res) {
  let { body } = req;
  if (body === undefined) {
    res.send(`Undefined!`);
    return;
  }
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    let db = JSON.parse(data);
    body.id = db.length;
    db.push(body);
    fs.writeFile('./db/db.json', JSON.stringify(db), err => {
      if(!err) {
        res.send('ok');
      } else {
        throw err;
      }
    });
  });
});
  
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    let db = JSON.parse(data);
    db.splice(req.params.id, 1);
    let reindex_db = db.map((currentElement, index) => {
      currentElement = { ...currentElement, id: index };
      return currentElement;
    });
      fs.writeFile("./db/db.json", JSON.stringify(reindex_db), (err) => {
        if (!err) {
          res.send("ok");
        } else {
          throw err;
        }
      });
    });
  });


// Server listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  