import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

const urgencyOptions = {
  Low: 'grey',
  Medium: 'orange',
  High: 'red',
  Done: 'green',
};

const TaskCard = ({ item, index, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [showUrgencyMenu, setShowUrgencyMenu] = useState(false);

  const handleSave = () => {
    const trimmed = editedContent.trim();
    if (trimmed && trimmed !== item.content) {
      onUpdate({ ...item, content: trimmed });
    }
    setIsEditing(false);
  };

  const changeUrgency = (color) => {
    onUpdate({ ...item, color });
    setShowUrgencyMenu(false);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            position: 'relative',
            userSelect: 'none',
            padding: 16,
            margin: '0 0 8px 0',
            minHeight: '50px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            ...provided.draggableProps.style,
          }}
        >
          {/* Urgency dot with dropdown menu */}
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <div
              onClick={() => setShowUrgencyMenu((prev) => !prev)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: item.color || 'gray',
                cursor: 'pointer',
              }}
              title="Click to change urgency"
            />
            {showUrgencyMenu && (
              <div style={{
                position: 'absolute',
                top: 16,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                padding: '4px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                zIndex: 999,
              }}>
                {Object.entries(urgencyOptions).map(([level, color]) => (
                  <div
                    key={level}
                    onClick={() => changeUrgency(color)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color:'black'
                    }}
                  >
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: color,
                      marginRight: 6,
                    }} />
                    {level}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task content (edit or view) */}
          {isEditing ? (
            <input
              autoFocus
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              style={{ width: '100%', border: '1px solid #ccc', padding: '4px' }}
            />
          ) : (
            <div onDoubleClick={() => setIsEditing(true)} style={{ color: 'black',  wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {item.content}
            </div>
          )}

          {/* Delete button */}
          <button
            onClick={onDelete}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '1rem',
            }}
          >
            ✖
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
