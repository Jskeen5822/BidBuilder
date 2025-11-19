const users = new Map();
const projects = new Map();

const defaultProjects = [
  {
    id: "BB-1024",
    name: "Community Recreation Center Renovation",
    owner: "City of Athens",
    budget: 240000,
    dueDate: "2025-07-30",
    scope:
      "Phased renovation of locker rooms, HVAC upgrades, and new solar-ready roofing.",
    bids: [
      { id: "bid-1", bidder: "Tri-State Builders", amount: 215000, timeline: "90 days" },
      { id: "bid-2", bidder: "Buckeye Construction", amount: 209500, timeline: "105 days" },
    ],
    winner: null,
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: "BB-1025",
    name: "Turn-Key Custom Lake House",
    owner: "The Grant Family",
    budget: 480000,
    dueDate: "2026-03-15",
    scope:
      "2,800 sq ft modern lake home with composite siding, full basement, and wraparound deck.",
    bids: [
      { id: "bid-3", bidder: "Blue Ridge Homes", amount: 455000, timeline: "180 days" },
      { id: "bid-4", bidder: "Atlas Residential", amount: 448000, timeline: "210 days" },
      { id: "bid-5", bidder: "Paramount Builders", amount: 439000, timeline: "195 days" },
    ],
    winner: "Paramount Builders",
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: "BB-1026",
    name: "Downtown Streetscape Refresh",
    owner: "Athens Chamber of Commerce",
    budget: 120000,
    dueDate: "2025-11-09",
    scope:
      "Concrete replacement, pedestrian lighting, and rain garden planters for Court Street.",
    bids: [],
    winner: null,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
];

defaultProjects.forEach((p) => projects.set(p.id, p));

function addUser({ name, email, password }) {
  if (users.has(email)) throw new Error("User already exists");
  const id = `user-${users.size + 1}`;
  const user = { id, name, email, password };
  users.set(email, user);
  return user;
}

function getUser(email) {
  return users.get(email);
}

function addProject({ id, name, owner, budget, dueDate, scope }) {
  if (projects.has(id)) throw new Error("Project already exists");
  const project = {
    id,
    name,
    owner,
    budget,
    dueDate,
    scope,
    bids: [],
    winner: null,
    createdAt: Date.now(),
  };
  projects.set(id, project);
  return project;
}

function listProjects() {
  return Array.from(projects.values()).sort((a, b) => b.createdAt - a.createdAt);
}

function addBid(projectId, { bidder, amount, timeline }) {
  const project = projects.get(projectId);
  if (!project) throw new Error("Project not found");
  const bid = {
    id: `bid-${project.bids.length + 1}`,
    bidder,
    amount,
    timeline,
  };
  project.bids.push(bid);
  return bid;
}

function selectWinningBid(projectId, bidId) {
  const project = projects.get(projectId);
  if (!project) throw new Error("Project not found");
  const bid = project.bids.find((b) => b.id === bidId);
  if (!bid) throw new Error("Bid not found");
  project.winner = bid.bidder;
  return project;
}

module.exports = {
  addUser,
  getUser,
  addProject,
  listProjects,
  addBid,
  selectWinningBid,
};
