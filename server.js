var path = require("path");
var fs = require("fs");
var express = require("express");
var app = express();
var tableData = require(".../db/db.json");
let notes = [];
// port
let PORT = process.env.PORT || 3001

// HTML routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
  });
  
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  
  // api routes
  app.get("/api/db", function(req, res) {
    res.json(tableData);
  });
  
  app.post("/api/db", function(req, res) {
  
    if (tableData.length < 5) {
      tableData.push(req.body);
      res.json(true);
    }
    else {
      waitListData.push(req.body);
      res.json(false);
    }
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
  