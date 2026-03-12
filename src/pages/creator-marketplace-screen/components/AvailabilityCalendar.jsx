import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AvailabilityCalendar = ({ availability, onUpdate }) => {
  const [selectedDates, setSelectedDates] = useState(availability || []);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1)?.getDay();
    const daysInMonth = new Date(year, month + 1, 0)?.getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);

  const toggleDate = (day) => {
    const dateStr = `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
    const updated = selectedDates?.includes(dateStr)
      ? selectedDates?.filter(d => d !== dateStr)
      : [...selectedDates, dateStr];
    setSelectedDates(updated);
    onUpdate?.(updated);
  };

  const monthName = currentMonth?.toLocaleString('default', { month: 'long', year: 'numeric' });
  const today = new Date();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Calendar" size={18} className="text-blue-500" />
          Availability Calendar
        </h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <span className="text-sm font-medium text-foreground">{monthName}</span>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']?.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay })?.map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1)?.map(day => {
          const dateStr = `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
          const isSelected = selectedDates?.includes(dateStr);
          const isPast = new Date(year, month, day) < today;
          return (
            <button
              key={day}
              onClick={() => !isPast && toggleDate(day)}
              disabled={isPast}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                isPast ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : isSelected ?'bg-green-500 text-white': 'hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        {selectedDates?.length} days selected as available
      </p>
    </div>
  );
};

export default AvailabilityCalendar;
