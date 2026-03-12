import React, { useState } from 'react';

const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
const EARNINGS_DATA = [1820, 2140, 2680, 2950, 3100, 3240];

const MobileEarningsChart = ({ earnings = EARNINGS_DATA }) => {
  const [selected, setSelected] = useState(null);
  const maxVal = Math.max(...earnings);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-bold">Earnings Trend</p>
        <span className="text-green-400 text-sm font-medium">+{Math.round(((earnings?.[earnings?.length-1] - earnings?.[0]) / earnings?.[0]) * 100)}% 6mo</span>
      </div>
      {selected !== null && (
        <div className="bg-gray-800 rounded-xl px-4 py-2 mb-3 text-center">
          <p className="text-white font-bold text-lg">${earnings?.[selected]?.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">{MONTHS?.[selected]}</p>
        </div>
      )}
      <div className="flex items-end gap-2 h-32">
        {earnings?.map((val, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className="flex-1 flex flex-col items-center gap-1 touch-manipulation"
          >
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ${
                selected === i ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'
              }`}
              style={{ height: `${(val / maxVal) * 100}%`, minHeight: '8px' }}
            />
            <span className="text-gray-500 text-xs">{MONTHS?.[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileEarningsChart;
