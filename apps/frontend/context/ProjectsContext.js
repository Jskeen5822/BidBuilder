import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchProjects,
  postProject,
  postBid,
  selectBid,
} from "../api/client";

const ProjectsContext = createContext(null);

const initialProjects = [
  {
    id: "BB-1024",
    name: "Community Recreation Center Renovation",
    owner: "City of Athens",
    budget: 240000,
    dueDate: "2025-07-30",
    scope:
      "Phased renovation of locker rooms, HVAC upgrades, and new solar-ready roofing.",
    bids: [
      {
        id: "bid-101",
        bidder: "Tri-State Builders",
        amount: 215000,
        timeline: "90 days",
      },
      {
        id: "bid-102",
        bidder: "Buckeye Construction",
        amount: 209500,
        timeline: "105 days",
      },
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
      { id: "bid-201", bidder: "Blue Ridge Homes", amount: 455000, timeline: "180 days" },
      { id: "bid-202", bidder: "Atlas Residential", amount: 448000, timeline: "210 days" },
      { id: "bid-203", bidder: "Paramount Builders", amount: 439000, timeline: "195 days" },
    ],
    winner: "Paramount Builders",
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: "BB-1026",
    name: "Downtown Streetscape Refresh",
    owner: "Athens Chamber of Commerce",
    budget: 120000,
    dueDate: "2025-11-10",
    scope:
      "Concrete replacement, pedestrian lighting, and rain garden planters for Court Street.",
    bids: [],
    winner: null,
    createdAt: Date.now() - 1000 * 60 * 15,
  },
];

export const sortOptions = [
  { label: "Most recent", value: "recent" },
  { label: "Largest budget", value: "budget" },
  { label: "Most bids", value: "bids" },
];

export const getBestBid = (bids) => {
  if (!bids.length) return null;
  return bids.reduce((best, bid) => (bid.amount < best.amount ? bid : best));
};

export const getBidByBidder = (bids, bidder) =>
  bids.find((bid) => bid.bidder === bidder) || null;

const sortProjects = (projects, order) => {
  return [...projects].sort((a, b) => {
    switch (order) {
      case "budget":
        return b.budget - a.budget;
      case "bids":
        return b.bids.length - a.bids.length;
      default:
        return b.createdAt - a.createdAt;
    }
  });
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [projectCounter, setProjectCounter] = useState(1027);
  const [sortOrder, setSortOrder] = useState(sortOptions[0].value);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((remoteProjects) => {
        if (!cancelled && Array.isArray(remoteProjects) && remoteProjects.length) {
          setProjects(remoteProjects);
          const highest = remoteProjects.reduce((max, project) => {
            const number = Number(project.id.split("-")[1]);
            return Number.isNaN(number) ? max : Math.max(max, number);
          }, 0);
          if (highest) setProjectCounter(highest);
        }
      })
      .catch((error) => {
        console.warn("Project sync failed, staying offline:", error.message);
        setSyncError("Offline mode: using local sample data.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProjects = useMemo(
    () => sortProjects(projects, sortOrder),
    [projects, sortOrder]
  );

  const replaceProject = (updatedProject) => {
    setProjects((current) => {
      let replaced = false;
      const mapped = current.map((project) => {
        if (project.id === updatedProject.id) {
          replaced = true;
          return updatedProject;
        }
        return project;
      });
      return replaced ? mapped : [updatedProject, ...mapped];
    });
  };

  const createProject = async (payload) => {
    const nextCounter = projectCounter + 1;
    setProjectCounter(nextCounter);
    const tempId = payload.id || `TMP-${nextCounter}`;
    const optimistic = {
      ...payload,
      id: tempId,
      bids: [],
      winner: null,
      createdAt: Date.now(),
    };
    setProjects((current) => [optimistic, ...current]);
    try {
      const saved = await postProject(payload);
      setProjects((current) => {
        const filtered = current.filter((project) => project.id !== tempId);
        return [saved, ...filtered];
      });
      const numeric = Number(String(saved.id).split("-")[1]);
      if (!Number.isNaN(numeric) && numeric > projectCounter) {
        setProjectCounter(numeric);
      }
    } catch (error) {
      console.warn("Failed to persist project:", error.message);
      setSyncError("Could not sync project to the server. Retry once online.");
    }
  };

  const addBid = async (projectId, bid) => {
    const bidEntry = {
      ...bid,
      id: `bid-${Date.now()}`,
    };
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, bids: [...project.bids, bidEntry] }
          : project
      )
    );
    try {
      const updatedProject = await postBid(projectId, bid);
      replaceProject(updatedProject);
    } catch (error) {
      console.warn("Failed to persist bid:", error.message);
      setSyncError("Could not sync bid to the server. Retry once online.");
    }
  };

  const acceptLowestBid = async (projectId) => {
    let selectedBid = null;
    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;
        const best = getBestBid(project.bids);
        selectedBid = best || null;
        if (!best) return project;
        return { ...project, winner: best.bidder };
      })
    );
    if (selectedBid?.id) {
      try {
        const project = await selectBid(projectId, selectedBid.id);
        replaceProject(project);
      } catch (error) {
        console.warn("Failed to persist winner:", error.message);
        setSyncError("Could not sync winner to the server. Retry once online.");
      }
    }
  };

  const value = {
    projects: sortedProjects,
    sortOrder,
    setSortOrder,
    createProject,
    addBid,
    acceptLowestBid,
    syncError,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
