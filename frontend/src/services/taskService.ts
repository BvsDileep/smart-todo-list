const API_BASE_URL = "http://localhost:4000/tasks"; // adjust if different

export const getTasks = async () => {
  const res = await fetch(API_BASE_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return res.json();
};

export const createTask = async (taskData: {
  title: string;
  description?: string;
  deadline: string;
}) => {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
  return res.json();
};

// Add updateTask and deleteTask later as needed.
