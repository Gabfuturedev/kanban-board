export const initialData = {
  columns: {
    todo: {
      name: 'To Do',
      items: [
        { id: '1', content: 'Create UI layout' },
        { id: '2', content: 'Style the board' }
      ],
    },
    inProgress: {
      name: 'In Progress',
      items: [
        { id: '3', content: 'Implement drag-and-drop' }
      ],
    },
    done: {
      name: 'Done',
      items: [
        { id: '4', content: 'Setup Vite + React project' }
      ],
    },
  },
};