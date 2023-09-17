const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(bodyParser.json());

const db = new sqlite3.Database("tasks.db", (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
  } else {
    console.log("Connected to the tasks database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN)",
      (err) => {
        if (err) {
          console.error("Error creating tasks table: " + err.message);
        } else {
          console.log("Tasks table created or already exists.");
        }
      }
    );
  }
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title is required." });
    return;
  }

  db.run("INSERT INTO tasks (title, completed) VALUES (?, ?)", [title, completed || false], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, title, completed });
  });
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", taskId, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Task deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("If you need to Access Database use /tasks and Use Postman to Get and POST method");
});