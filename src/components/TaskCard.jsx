import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ item, index, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);

  const handleSave = () => {
    const trimmed = editedContent.trim();
    if (trimmed && trimmed !== item.content) {
      onUpdate(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: 'none',
            padding: 16,
            margin: '0 0 8px 0',
            minHeight: '50px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...provided.draggableProps.style,
          }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <input
              autoFocus
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          ) : (
            <>
              <span style={{ color: 'black', flexGrow: 1 }}>{item.content}</span>
              <button
                onClick={onDelete}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '1rem',
                  marginLeft: 8,
                }}
              >
                ✖
              </button>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
