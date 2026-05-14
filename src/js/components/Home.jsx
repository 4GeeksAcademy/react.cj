import React, { useState, useEffect } from "react";

const BASE = "https://playground.4geeks.com/todo";

const Home = () => {
  const [username, setUsername] = useState("charleychimpy07-png");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [status, setStatus] = useState("No user loaded");

  // Load tasks whenever currentUser changes
useEffect(() => {
  const initUser = async () => {
    let res = await fetch(`${BASE}/users/${username}`);

    if (res.status === 404) {
      res = await fetch(`${BASE}/users/${username}`, { method: "POST" });
      setStatus(`User "${username}" created`);
    }

    if (!res.ok) return setStatus("Error loading user");

    const data = await res.json();
    setTasks(data.todos || []);
    setStatus(`Logged in as ${username}`);
  };

  initUser();
}, []);

  const fetchTasks = async () => {
    const res = await fetch(`${BASE}/users/${username}`);
    if (!res.ok) return;
    const data = await res.json();
    setTasks(data.todos || []);
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !username) return;

    const res = await fetch(`${BASE}/todos/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newTask, done: false }),
    });

    if (!res.ok) return setStatus("Error adding task");
    setNewTask("");
    await fetchTasks(); // re-fetch to get updated list from server
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
    if (!res.ok) return setStatus("Error deleting task");
    await fetchTasks();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2>Todo App</h2>
      <p className="text-muted">{status}</p>

      {/* Add task */}
      <div className="input-group mb-4">
        <input
          className="form-control"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddTask()}
          placeholder="New task..."

        />
        <button className="btn btn-primary" onClick={handleAddTask}>
          Add
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="text-muted text-center">No tasks yet</p>
      ) : (
        <ul className="list-group">
          {tasks.map(t => (
            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{t.label}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;