"use strict";
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userPath = path.join(__dirname, "users.json");
app.post("/register", async (req, res) => {
  let { username, password, repass } = req.body;
  username = username ? username.trim() : "";
  if (!username || !password) {
    return res.json({ message: "Please fill in all blank" });
  }
  if (repass !== password) {
    return res.json({ message: "Password do not match" });
  }
  try {
    await fs.access(userPath);
  } catch {
    return res.status(404).json("File does not exist");
  }
  let users = {};
  try {
    const data = await fs.readFile(userPath, "utf8");
    users = JSON.parse(data);
  } catch {
    users = {};
  }
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = {
    password: hashedPassword,
  };
  try {
    await fs.writeFile(userPath, JSON.stringify(users, null, 2));
    return res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error writing file" });
  }
});
async function loadUser() {
  const userPath = path.join(__dirname, "users.json");
  const data = await fs.readFile(userPath, "utf8");
  return JSON.parse(data);
}
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({ message: "Please enter username and password" });
  }
  let users;
  try {
    users = await loadUser();
  } catch {
    return res.status(500).json({ message: "Cannot read users file" });
  }
  const user = users[username];
  if (!user) {
    return res.json({ message: "Username is incorrect" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ message: "Password does not match" });
  }
  return res.json({ message: "Login successfully" });
});
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
