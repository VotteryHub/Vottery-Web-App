import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DeliverablesChecklist = ({ deliverables = [], onUpdate }) => {
  const [items, setItems] = useState(
    deliverables?.length > 0 ? deliverables : [
      { id: 1, text: 'Initial concept/draft delivery', completed: false, dueDate: '' },
      { id: 2, text: 'Revision round 1', completed: false, dueDate: '' },
      { id: 3, text: 'Final delivery', completed: false, dueDate: '' }
    ]
  );
  const [newItem, setNewItem] = useState('');

  const toggleItem = (id) => {
    const updated = items?.map(item => item?.id === id ? { ...item, completed: !item?.completed } : item);
    setItems(updated);
    onUpdate?.(updated);
  };

  const addItem = () => {
    if (!newItem?.trim()) return;
    const updated = [...items, { id: Date.now(), text: newItem?.trim(), completed: false, dueDate: '' }];
    setItems(updated);
    setNewItem('');
    onUpdate?.(updated);
  };

  const removeItem = (id) => {
    const updated = items?.filter(item => item?.id !== id);
    setItems(updated);
    onUpdate?.(updated);
  };

  const completedCount = items?.filter(i => i?.completed)?.length;
  const progress = items?.length > 0 ? (completedCount / items?.length) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="CheckSquare" size={18} className="text-green-500" />
          Deliverables Checklist
        </h4>
        <span className="text-sm text-muted-foreground">{completedCount}/{items?.length} done</span>
      </div>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full mb-4">
        <div
          className="h-2 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Items */}
      <div className="space-y-2 mb-4">
        {items?.map(item => (
          <div key={item?.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group">
            <button
              onClick={() => toggleItem(item?.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                item?.completed
                  ? 'bg-green-500 border-green-500' :'border-gray-300 dark:border-gray-500'
              }`}
            >
              {item?.completed && <Icon name="Check" size={12} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${
              item?.completed ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {item?.text}
            </span>
            <button
              onClick={() => removeItem(item?.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
            >
              <Icon name="X" size={12} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e?.target?.value)}
          onKeyDown={e => e?.key === 'Enter' && addItem()}
          placeholder="Add deliverable..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          onClick={addItem}
          disabled={!newItem?.trim()}
          className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Icon name="Plus" size={16} />
        </button>
      </div>
    </div>
  );
};

export default DeliverablesChecklist;
