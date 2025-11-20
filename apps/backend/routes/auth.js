const express = require("express");
const router = express.Router();
const { addUser, getUser } = require("../data/store");

router.post("/register", (req, res) => {
  const { name, email, password, company } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  try {
    const user = addUser({ name, email, password, company });
    return res
      .status(201)
      .json({ id: user.id, name: user.name, email: user.email, company: user.company });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = getUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  return res.json({
    token: `mock-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

module.exports = router;
