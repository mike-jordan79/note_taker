const express = require("express");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");
const PORT = 3010;

const app = express();

app.use(express.json());

app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

app.get("/notes", (req, res) => {
  res.render("notes.html");
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      const db = JSON.parse(data);
      res.json(db);
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.log("body: ", req.body);
  let newNote = req.body;
  newNote.id = nanoid(10);
//   console.log({ newNote: newNote });

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      const db = JSON.parse(data);

      db.push(newNote);

      fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    }
  });

  res.end();
});

app.delete("/api/notes/:id", (req, res) => {
  console.log({ id: req.params.id });
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
    } else {
      const db = JSON.parse(data);

      const filterArr = db.filter((item) => item.id !== req.params.id);

      fs.writeFile("./db/db.json", JSON.stringify(filterArr), function (err) {
        if (err) throw err;
      });
    }
  });
  res.end();
});

app.get("*", (req, res) => {
  res.render("index.html");
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${PORT}`);
});
