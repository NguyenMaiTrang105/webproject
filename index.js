"use strict";
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const session = require("express-session");
const app = express();
const bcrypt = require("bcrypt");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
function validatePassword(password) {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
}
const userPath = path.join(__dirname, "users.json");
app.post("/register", async (req, res) => {
  let { username, password, repass } = req.body;
  username = username ? username.trim() : "";
  if (!username || !password || !repass) {
    return res.status(400).json({ message: "Please fill in all blank" });
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (repass !== password) {
    return res.json({ message: "Password do not match" });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
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
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  let users;
  try {
    users = await loadUser();
  } catch {
    return res.status(500).json({ message: "Cannot read users file" });
  }
  const user = users[username];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  req.session.user = {
    username: username,
  };
  return res.json({ message: "Login successful" });
});
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.send(`
    <h1>Profile</h1>
    <p>Username: ${req.session.user.username}</p>
    <a href="/logout">Logout</a>
  `);
});
app.get("/login", (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button>Login</button>
    </form>
  `);
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
