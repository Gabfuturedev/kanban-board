import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const Column = ({ columnId, column, addTask, deleteTask, updateTask }) => {
  return (
    <div style={{ minWidth: 250, backgroundColor: '#000', padding: '1rem', borderRadius: '8px' }}>
      <h3>{column.name}</h3>
      <button onClick={() => addTask(columnId)} style={{ marginBottom: '1rem' }}>➕ Add Task</button>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ minHeight: 100 }}
          >
            {column.items.map((item, index) => (
              <TaskCard key={item.id} item={item} index={index} onDelete={() => deleteTask(columnId, item.id)} onUpdate={(newContent) => updateTask(columnId, item.id, newContent)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
