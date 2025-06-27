import { Draggable } from '@hello-pangea/dnd';

const TaskCard = ({ item, index, onDelete }) => {
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
        >
          <span style={{color:'black'}} >{item.content}</span>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1rem' }}>✖</button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
