import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Draggable } from '@hello-pangea/dnd';
import { PRIORITIES, priorityForColor } from '../constants/priorities';
import { PencilIcon, TrashIcon } from './icons';
import './TaskCard.css';

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return null;
  const diffMs = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

const TaskCard = ({ item, index, onDelete, onUpdate, isDimmed }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [menuPosition, setMenuPosition] = useState(null);
  const badgeRef = useRef(null);
  const menuRef = useRef(null);

  const showPriorityMenu = menuPosition !== null;

  const toggleMenu = () => {
    if (showPriorityMenu) {
      setMenuPosition(null);
      return;
    }
    const rect = badgeRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 4, left: rect.left });
  };

  useEffect(() => {
    if (!showPriorityMenu) return;

    const handleClickOutside = (e) => {
      if (
        badgeRef.current &&
        !badgeRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuPosition(null);
      }
    };
    const closeMenu = () => setMenuPosition(null);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [showPriorityMenu]);

  const handleSave = () => {
    const trimmed = editedContent.trim();
    if (trimmed && trimmed !== item.content) {
      onUpdate({ ...item, content: trimmed });
    } else {
      setEditedContent(item.content);
    }
    setIsEditing(false);
  };

  const changePriority = (color) => {
    onUpdate({ ...item, color });
    setMenuPosition(null);
  };

  const priority = priorityForColor(item.color);
  const relativeTime = formatRelativeTime(item.createdAt);

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card${snapshot.isDragging ? ' is-dragging' : ''}${
            isDimmed ? ' is-dimmed' : ''
          }`}
          style={{
            '--card-accent': item.color || 'transparent',
            ...provided.draggableProps.style,
          }}
        >
          <div className="task-card-top">
            <div className="priority-picker">
              <button
                type="button"
                ref={badgeRef}
                className="priority-badge"
                onClick={toggleMenu}
                title="Change priority"
                style={
                  priority
                    ? { '--tag-color': priority.color, '--tag-soft': `${priority.color}26` }
                    : undefined
                }
              >
                {priority ? priority.code : 'NONE'}
              </button>
              {showPriorityMenu &&
                createPortal(
                  <div
                    className="priority-menu"
                    ref={menuRef}
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                  >
                    {PRIORITIES.map(({ label, code, color }) => (
                      <div
                        key={label}
                        className="priority-menu-item"
                        style={{ '--item-color': color }}
                        onClick={() => changePriority(color)}
                      >
                        {code}
                      </div>
                    ))}
                  </div>,
                  document.body
                )}
            </div>

            <div className="task-card-actions">
              <button
                className="task-card-action-btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
                title="Edit"
              >
                <PencilIcon width={13} height={13} />
              </button>
              <button
                className="task-card-action-btn danger"
                onClick={onDelete}
                aria-label="Delete task"
                title="Delete"
              >
                <TrashIcon width={13} height={13} />
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              autoFocus
              className="task-card-edit-input"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Escape') {
                  setEditedContent(item.content);
                  setIsEditing(false);
                }
              }}
            />
          ) : (
            <div className="task-card-content" onDoubleClick={() => setIsEditing(true)}>
              {item.content}
            </div>
          )}

          {relativeTime && <div className="task-card-meta">{relativeTime}</div>}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
