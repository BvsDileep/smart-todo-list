"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskFormProps {
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  existingTask?: Task | null;
}

export default function CreateTaskForm({
  onTaskCreated,
  onTaskUpdated,
  existingTask,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || "");
      setDeadline(existingTask.deadline.slice(0, 16)); // format for datetime-local
    }
  }, [existingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !deadline) {
      alert("Title and Deadline are required!");
      return;
    }

    try {
      setLoading(true);

      if (existingTask && onTaskUpdated) {
        // Edit flow
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/${existingTask.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              description,
              deadline,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask: Task = await res.json();
        onTaskUpdated(updatedTask);
      } else if (onTaskCreated) {
        // Create flow
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              description,
              deadline,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to create task");
        }

        const newTask: Task = await res.json();
        onTaskCreated(newTask);

        // Clear form after creating
        setTitle("");
        setDescription("");
        setDeadline("");
      }
    } catch (err) {
      console.error(err);
      alert(existingTask ? "Error updating task." : "Error creating task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow mt-6 space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {existingTask ? "Edit Task" : "Add New Task"}
      </h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2"
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`${
          existingTask ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        } text-white rounded px-4 py-2 disabled:opacity-50`}
      >
        {loading
          ? existingTask
            ? "Updating..."
            : "Adding..."
          : existingTask
          ? "Update Task"
          : "Add Task"}
      </button>
    </form>
  );
}
