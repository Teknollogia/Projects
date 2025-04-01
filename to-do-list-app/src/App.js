import React, { useState } from "react";
import "./styles.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") {
      setError("Please enter a task before adding!"); // Set error message
      setTimeout(() => setError(""), 3000); // Remove message after 3 seconds
      return;
    }
    if(tasks.find(task => task.text === newTask)) {
      setError("Task already exists!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
    alert("Task added successfully!");
    setError(""); // Clear any previous error message
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div id = "mylist">
      <h1>To-Do List</h1>

      {error && <p className="error-message">{error}</p>}

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.text}
            <button onClick={() => toggleTask(index)}>✔</button>
            <button onClick={() => deleteTask(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
