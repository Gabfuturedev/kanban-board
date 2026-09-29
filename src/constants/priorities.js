export const PRIORITIES = [
  { label: 'Low', code: 'LOW', color: '#7c8798' },
  { label: 'Medium', code: 'MED', color: '#c9822f' },
  { label: 'High', code: 'HIGH', color: '#c44f68' },
  { label: 'Done', code: 'DONE', color: '#5f9a52' },
];

export const priorityForColor = (color) => PRIORITIES.find((p) => p.color === color) || null;
