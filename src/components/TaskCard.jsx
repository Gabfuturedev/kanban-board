import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

const urgencyOptions = {
  Low: "grey",
  Medium: "orange",
  High: "red",
  Done: "green",
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
            position: "relative",
            userSelect: "none",
            padding: 16,
            marginBottom: 12,
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            transition: "all 0.2s ease",
            ...provided.draggableProps.style,
          }}
        >
          {/* Urgency dot & dropdown */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <div
              onClick={() => setShowUrgencyMenu(prev => !prev)}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: item.color || "gray",
                cursor: "pointer",
                border: "2px solid white",
                boxShadow: "0 0 0 1px #ccc",
              }}
              title="Click to change urgency"
            />
            {showUrgencyMenu && (
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 0,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 10,
                  padding: "4px 0",
                  minWidth: 100,
                }}
              >
                {Object.entries(urgencyOptions).map(([level, color]) => (
                  <div
                    key={level}
                    onClick={() => changeUrgency(color)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: "#333",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: color,
                      marginRight: 8,
                    }} />
                    {level}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content + Delete */}
          <div style={{
            marginLeft: 30,
            paddingRight: 24,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8,
          }}>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  autoFocus
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    padding: "6px",
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                  }}
                />
              ) : (
                <div
                  onDoubleClick={() => setIsEditing(true)}
                  style={{
                    color: "#111",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.content}
                </div>
              )}
            </div>

            <button
              onClick={onDelete}
              aria-label="Delete task"
              title="Delete"
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "1.1rem",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
