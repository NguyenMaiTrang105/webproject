"use strict";
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userPath = path.join(__dirname, "users.json");
app.post("/register", async (req, res) => {
  let { username, password, repass } = req.body;
  username = username ? username.trim() : "";
  if (!username || !password) {
    return res.send("Please fill in all blank");
  }
  if (repass !== password) {
    return res.send("Password do not match");
  }
  try {
    await fs.access(userPath);
  } catch {
    return res.status(404).send("File does not exist");
  }
  let users = {};
  try {
    const data = await fs.readFile(userPath, "utf8");
    users = JSON.parse(data);
  } catch {
    users = {};
  }
  if (users[username]) {
    return res.send("Username already exists");
  }
  users[username] = {
    password: password,
  };
  try {
    await fs.writeFile(userPath, JSON.stringify(users, null, 2));
    return res.send("User registered successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error writting file");
  }
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
});
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
