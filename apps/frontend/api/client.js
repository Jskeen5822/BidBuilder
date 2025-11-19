const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

const jsonRequest = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(message.error || "Request failed");
  }
  return response.json();
};

export const fetchProjects = () => jsonRequest("/projects");

export const postProject = (project) =>
  jsonRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

export const postBid = (projectId, bid) =>
  jsonRequest(`/projects/${projectId}/bids`, {
    method: "POST",
    body: JSON.stringify(bid),
  });

export const selectBid = (projectId, bidId) =>
  jsonRequest(`/projects/${projectId}/select`, {
    method: "POST",
    body: JSON.stringify({ bidId }),
  });

export const register = (user) =>
  jsonRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const login = (credentials) =>
  jsonRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
