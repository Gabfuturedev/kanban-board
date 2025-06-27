// components/Board.jsx
import { useEffect, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import { initialData } from '../../data/InitialData';
import { v4 as uuid } from 'uuid';

const Board = () => {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban-columns');
    return saved ? JSON.parse(saved) : initialData.columns;
  });

  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
  }, [columns]);

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

  const addTask = (columnId) => {
    const content = prompt('Enter task content:');
    if (!content || !content.trim()) return;
    const newItem = { id: uuid(), content: content.trim() };
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
    const filtered = column.items.filter((item) => item.id !== taskId);
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: filtered,
      },
    });
  };

  const updateTask = (columnId, taskId, newContent) => {
  const column = columns[columnId];
  const updatedItems = column.items.map((item) =>
    item.id === taskId ? { ...item, content: newContent } : item
  );
  setColumns({
    ...columns,
    [columnId]: {
      ...column,
      items: updatedItems,
    },
  });
};


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        {Object.entries(columns).map(([id, column]) => (
          <Column key={id} columnId={id} column={column} addTask={addTask} deleteTask={deleteTask} updateTask={updateTask} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
