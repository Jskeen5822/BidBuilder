const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Bidzilla API",
    version: "1.0.0",
    routes: ["/auth/register", "/auth/login", "/projects"],
  });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Bidzilla API listening on http://localhost:${PORT}`);
});
