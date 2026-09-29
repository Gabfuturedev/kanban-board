// components/Board.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import AddColumn from './AddColumn';
import { initialData } from '../../data/InitialData';
import { PRIORITIES } from '../constants/priorities';
import { SunIcon, MoonIcon, SearchIcon, XIcon } from './icons';
import { v4 as uuid } from 'uuid';

const THEME_KEY = 'kanban-theme';

const Board = () => {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-columns');
    return saved ? JSON.parse(saved) : initialData.columns;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePriorities, setActivePriorities] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    return () => clearTimeout(toastTimeoutRef.current);
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  const addTask = (columnId, content) => {
    const newItem = { id: uuid(), content, createdAt: Date.now() };
    const column = columns[columnId];
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: [...column.items, newItem],
      },
    });
  };

  const deleteTask = (columnId, taskId) => {
    const column = columns[columnId];
    const index = column.items.findIndex((item) => item.id === taskId);
    if (index === -1) return;
    const [removed] = column.items.slice(index, index + 1);
    const filtered = column.items.filter((item) => item.id !== taskId);

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: filtered,
      },
    });

    clearTimeout(toastTimeoutRef.current);
    setToast({ columnId, item: removed, index });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
  };

  const undoDelete = () => {
    if (!toast) return;
    clearTimeout(toastTimeoutRef.current);
    setColumns((prev) => {
      const column = prev[toast.columnId];
      if (!column) return prev;
      const items = [...column.items];
      items.splice(Math.min(toast.index, items.length), 0, toast.item);
      return {
        ...prev,
        [toast.columnId]: { ...column, items },
      };
    });
    setToast(null);
  };

  const updateTask = (columnId, taskId, updatedItem) => {
    const column = columns[columnId];
    const updatedItems = column.items.map((item) =>
      item.id === taskId ? { ...item, ...updatedItem } : item
    );

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: updatedItems,
      },
    });
  };

  const addColumn = (name) => {
    const id = uuid();
    setColumns({
      ...columns,
      [id]: { name, items: [] },
    });
  };

  const deleteColumn = (columnId) => {
    const next = { ...columns };
    delete next[columnId];
    setColumns(next);
  };

  const renameColumn = (columnId, newName) => {
    setColumns({
      ...columns,
      [columnId]: { ...columns[columnId], name: newName },
    });
  };

  const togglePriorityFilter = (color) => {
    setActivePriorities((prev) => {
      const next = new Set(prev);
      if (next.has(color)) {
        next.delete(color);
      } else {
        next.add(color);
      }
      return next;
    });
  };

  const isMatch = (item) => {
    const matchesSearch =
      !searchQuery.trim() || item.content.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesPriority = activePriorities.size === 0 || activePriorities.has(item.color);
    return matchesSearch && matchesPriority;
  };

  const { totalTasks, totalColumns, priorityCounts } = useMemo(() => {
    const cols = Object.values(columns);
    const counts = {};
    cols.forEach((col) =>
      col.items.forEach((item) => {
        if (item.color) counts[item.color] = (counts[item.color] || 0) + 1;
      })
    );
    return {
      totalTasks: cols.reduce((sum, col) => sum + col.items.length, 0),
      totalColumns: cols.length,
      priorityCounts: counts,
    };
  }, [columns]);

  const isFiltering = searchQuery.trim() !== '' || activePriorities.size > 0;

  return (
    <>
      <header className="app-topbar">
        <h1 className="brand">
          Dev Board<span className="brand-caret" aria-hidden="true" />
        </h1>

        <div className="stat-card">
          <div className="stat-block">
            <span className="stat-value">{totalColumns}</span>
            <span className="stat-label">columns</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-block">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">tasks</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-breakdown">
            <div className="stat-bar">
              {PRIORITIES.map(({ label, color }) => (
                <span
                  key={label}
                  className="stat-bar-segment"
                  style={{
                    '--seg-color': color,
                    width: totalTasks ? `${((priorityCounts[color] || 0) / totalTasks) * 100}%` : 0,
                  }}
                />
              ))}
            </div>
            <div className="stat-bar-keys">
              {PRIORITIES.map(({ label, code, color }) => (
                <span className="stat-bar-key" key={label} title={label}>
                  <span className="dot" style={{ '--key-color': color }} />
                  {priorityCounts[color] || 0}
                  <span className="visually-hidden">{code}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-field">
            <SearchIcon />
            <input
              className="search-input"
              type="search"
              placeholder="search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks"
            />
          </div>
          <div className="severity-filters">
            {PRIORITIES.map(({ label, code, color }) => (
              <button
                key={label}
                className={`severity-chip${activePriorities.has(color) ? ' active' : ''}`}
                style={{ '--chip-color': color, '--chip-soft': `${color}26` }}
                onClick={() => togglePriorityFilter(color)}
                aria-pressed={activePriorities.has(color)}
                title={`Filter by ${label} priority`}
              >
                {code}
              </button>
            ))}
          </div>
          <button
            className="icon-btn"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.entries(columns).map(([id, column]) => (
            <Column
              key={id}
              columnId={id}
              column={column}
              addTask={addTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              deleteColumn={deleteColumn}
              renameColumn={renameColumn}
              isMatch={isFiltering ? isMatch : () => true}
            />
          ))}
          <AddColumn onAdd={addColumn} />
        </div>
      </DragDropContext>

      <footer className="statusbar">
        <div className="statusbar-segment">
          <span>{theme} theme</span>
          {isFiltering && <span className="statusbar-flag">filtered</span>}
        </div>
        <div className="statusbar-legend">
          {PRIORITIES.map(({ label, code, color }) => (
            <span className="statusbar-legend-item" key={label} title={label}>
              <span className="statusbar-swatch" style={{ '--swatch-color': color }} />
              {code} {priorityCounts[color] || 0}
            </span>
          ))}
        </div>
      </footer>

      {toast && (
        <div className="toast" role="status">
          <span>Task deleted</span>
          <button className="toast-undo" onClick={undoDelete}>
            undo
          </button>
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Dismiss">
            <XIcon width={13} height={13} />
          </button>
        </div>
      )}
    </>
  );
};

export default Board;
