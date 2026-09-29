import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { PlusIcon, XIcon } from './icons';
import './Column.css';

const hashHue = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 360;
  }
  return hash;
};

const Column = ({
  columnId,
  column,
  addTask,
  deleteTask,
  updateTask,
  deleteColumn,
  renameColumn,
  isMatch,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.name);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const tabColor = `hsl(${hashHue(columnId)}, 42%, 58%)`;

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.name) {
      renameColumn(columnId, trimmed);
    } else {
      setTitleDraft(column.name);
    }
    setIsEditingTitle(false);
  };

  const submitNewTask = () => {
    const trimmed = newTaskText.trim();
    if (trimmed) {
      addTask(columnId, trimmed);
    }
    setNewTaskText('');
    setIsAddingTask(false);
  };

  const handleDeleteColumn = () => {
    const count = column.items.length;
    const message = count
      ? `Delete "${column.name}" and its ${count} task${count === 1 ? '' : 's'}?`
      : `Delete "${column.name}"?`;
    if (window.confirm(message)) {
      deleteColumn(columnId);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-indicator" style={{ '--tab-color': tabColor }} />
        {isEditingTitle ? (
          <input
            autoFocus
            className="column-title-input"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') {
                setTitleDraft(column.name);
                setIsEditingTitle(false);
              }
            }}
          />
        ) : (
          <h3
            className="column-title"
            onClick={() => setIsEditingTitle(true)}
            title="Click to rename"
          >
            {column.name}
          </h3>
        )}
        <span className="column-count">{column.items.length}</span>
        <button
          className="column-delete-btn"
          onClick={handleDeleteColumn}
          aria-label={`Delete ${column.name} column`}
          title="Delete column"
        >
          <XIcon width={13} height={13} />
        </button>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`column-list${snapshot.isDraggingOver ? ' is-dragging-over' : ''}`}
          >
            {column.items.length === 0 && (
              <div className="column-empty">No tasks yet</div>
            )}
            {column.items.map((item, index) => (
              <TaskCard
                key={item.id}
                item={item}
                index={index}
                onDelete={() => deleteTask(columnId, item.id)}
                onUpdate={(newItem) => updateTask(columnId, item.id, newItem)}
                isDimmed={!isMatch(item)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="column-footer">
        {isAddingTask ? (
          <div className="add-task-form">
            <textarea
              autoFocus
              placeholder="Task description…"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitNewTask();
                }
                if (e.key === 'Escape') {
                  setNewTaskText('');
                  setIsAddingTask(false);
                }
              }}
            />
            <div className="add-task-form-actions">
              <button className="btn btn-primary" onClick={submitNewTask}>
                Add task
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setNewTaskText('');
                  setIsAddingTask(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="add-task-btn" onClick={() => setIsAddingTask(true)}>
            <PlusIcon width={12} height={12} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
