require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : "*";

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Bidzilla API",
    version: "1.0.0",
    routes: ["/auth/register", "/auth/login", "/projects"],
    readyForDb: Boolean(process.env.DATABASE_URL || process.env.USE_DATABASE),
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
  if (process.env.DATABASE_URL || process.env.USE_DATABASE) {
    console.log("Database flag detected. Connect your DB client in data/store.js.");
  }
});
