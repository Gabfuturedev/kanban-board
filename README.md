# 🧠 Kanban Todo Board - React + Vite

This is a simple yet powerful **Kanban-style todo board** built with **React (Vite)** and **drag-and-drop** support using `@hello-pangea/dnd`. It allows you to create tasks, drag them between columns, delete them, and persist your work automatically in the browser.

---

## 📦 Tech Stack

* ⚛️ React (with Vite for fast bundling)
* 🧩 @hello-pangea/dnd (React drag-and-drop)
* 💾 localStorage (persistent browser data)
* 🔢 uuid (generates unique IDs for each task)

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── Board.jsx       # Main board logic
│   ├── Column.jsx      # Individual column component
│   └── TaskCard.jsx    # Draggable task cards
├── data/
│   └── InitialData.js  # Default column/task data
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

---

## 🚀 Features

### ✅ Drag and Drop

Move tasks between columns or reorder within a column.

### ➕ Add Tasks

Click “Add Task” to prompt for task content. Tasks appear immediately in the correct column.

### ❌ Delete Tasks

Click the ❌ icon to remove a task from the board.

### 💾 Auto-Persistence

Your tasks are saved to `localStorage`, so they're still there when you reload the page.

### 🔐 Unique IDs (uuid)

We use the `uuid` package to assign a unique `id` to each task so React can track and manage them easily.

```js
import { v4 as uuid } from 'uuid';
const newItem = { id: uuid(), content: 'My Task' };
```

This creates a unique string like:

```
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

Which helps React and the app identify, delete, or move tasks accurately.

---

## 🧠 How It Works (Simplified)

### 1. Load Columns

```js
const [columns, setColumns] = useState(() => {
  const saved = localStorage.getItem('kanban-columns');
  return saved ? JSON.parse(saved) : initialData.columns;
});
```

This checks if there's saved data, otherwise loads defaults.

### 2. Add Task

```js
const newItem = { id: uuid(), content: 'Task' };
```

It appends that `newItem` into the selected column and saves it.

### 3. Drag & Drop

The `onDragEnd` function updates column/task order based on source and destination, and sets the new state.

### 4. Delete Task

Uses `filter()` to remove a task by ID.

---

## 🧪 To Run the App

```bash
git clone <your-repo-url>
cd kanban-board
npm install
npm run dev
```

Then visit: [http://localhost:5173](http://localhost:5173)

---

## 🌱 Future Ideas

* 🌙 Dark mode toggle
* ✏️ Edit tasks
* 📆 Due dates or reminders
* ☁️ Firebase sync across devices
* 🗑️ Clear all tasks per column

---

Made with 💻 by \[Gabriel Manialong]
