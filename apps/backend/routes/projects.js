const express = require("express");
const router = express.Router();
const {
  addProject,
  addBid,
  listProjects,
  selectWinningBid,
} = require("../data/store");

router.get("/", (_req, res) => {
  const projects = listProjects();
  return res.json(projects);
});

router.post("/", (req, res) => {
  const { id, name, owner, budget, dueDate, scope } = req.body || {};
  if (!name || !owner || !budget || !dueDate || !scope) {
    return res.status(400).json({ error: "Missing required project fields." });
  }
  const created = addProject({ id, name, owner, budget, dueDate, scope });
  return res.status(201).json(created);
});

router.post("/:projectId/bids", (req, res) => {
  const { projectId } = req.params;
  const { bidder, amount, timeline } = req.body || {};
  if (!bidder || !amount || !timeline) {
    return res.status(400).json({ error: "Bidder, amount, and timeline are required." });
  }
  try {
    const project = addBid(projectId, { bidder, amount, timeline });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.post("/:projectId/select", (req, res) => {
  const { projectId } = req.params;
  const { bidId } = req.body || {};
  if (!bidId) {
    return res.status(400).json({ error: "bidId is required to select a winner." });
  }
  try {
    const project = selectWinningBid(projectId, bidId);
    return res.json(project);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

module.exports = router;
