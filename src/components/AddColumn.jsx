import { useState } from 'react';
import { PlusIcon } from './icons';

const AddColumn = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const reset = () => {
    setIsAdding(false);
    setName('');
  };

  const submit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
    }
    reset();
  };

  if (!isAdding) {
    return (
      <div className="board-add-column">
        <button className="add-column-btn" onClick={() => setIsAdding(true)}>
          <PlusIcon width={12} height={12} />
          Add column
        </button>
      </div>
    );
  }

  return (
    <div className="add-column-form">
      <input
        autoFocus
        placeholder="Column name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') reset();
        }}
      />
      <div className="add-column-form-actions">
        <button className="btn btn-primary" onClick={submit}>
          Add
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddColumn;
