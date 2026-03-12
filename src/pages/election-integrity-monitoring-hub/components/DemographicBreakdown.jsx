import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const AGE_DATA = [
  { group: '18-24', votes: 1234567, pct: 18.2, color: '#3B82F6' },
  { group: '25-34', votes: 2345678, pct: 24.5, color: '#8B5CF6' },
  { group: '35-44', votes: 1987654, pct: 21.3, color: '#10B981' },
  { group: '45-54', votes: 1654321, pct: 17.8, color: '#F59E0B' },
  { group: '55-64', votes: 987654, pct: 11.4, color: '#EF4444' },
  { group: '65+', votes: 654321, pct: 6.8, color: '#6B7280' },
];

const GENDER_DATA = [
  { name: 'Male', value: 48.3, color: '#3B82F6' },
  { name: 'Female', value: 49.1, color: '#EC4899' },
  { name: 'Non-binary', value: 2.6, color: '#8B5CF6' },
];

const TIER_DATA = [
  { tier: 'Bronze', voters: 4521093, color: '#CD7F32' },
  { tier: 'Silver', voters: 2834721, color: '#C0C0C0' },
  { tier: 'Gold', voters: 1234567, color: '#FFD700' },
  { tier: 'Platinum', voters: 456789, color: '#E5E4E2' },
  { tier: 'Elite', voters: 123456, color: '#B9F2FF' },
];

const DemographicBreakdown = () => {
  const [activeTab, setActiveTab] = useState('age');

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Users className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Demographic Analytics</h3>
            <p className="text-gray-400 text-sm">Age groups, gender distribution, voter tier levels</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['age', 'gender', 'tier']?.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'age' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_DATA} layout="vertical">
                <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis dataKey="group" type="category" tick={{ fill: '#9CA3AF', fontSize: 11 }} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(v) => [`${v?.toLocaleString()} votes`, 'Votes']}
                />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                  {AGE_DATA?.map((entry, idx) => (
                    <Cell key={idx} fill={entry?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {AGE_DATA?.map((item) => (
              <div key={item?.group} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item?.color }} />
                <span className="text-gray-400 text-sm w-12">{item?.group}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${item?.pct}%`, backgroundColor: item?.color }} />
                </div>
                <span className="text-white text-sm w-12 text-right">{item?.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'gender' && (
        <div className="grid grid-cols-2 gap-6 items-center">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GENDER_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {GENDER_DATA?.map((entry, idx) => (
                    <Cell key={idx} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(v) => [`${v}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {GENDER_DATA?.map((item) => (
              <div key={item?.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item?.color }} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 text-sm">{item?.name}</span>
                    <span className="text-white font-medium text-sm">{item?.value}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${item?.value}%`, backgroundColor: item?.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'tier' && (
        <div className="space-y-3">
          {TIER_DATA?.map((item) => {
            const maxVoters = Math.max(...TIER_DATA?.map(t => t?.voters));
            return (
              <div key={item?.tier} className="flex items-center gap-4">
                <span className="text-gray-300 text-sm w-16 font-medium" style={{ color: item?.color }}>{item?.tier}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{ width: `${(item?.voters / maxVoters) * 100}%`, backgroundColor: item?.color }}
                  />
                </div>
                <span className="text-white text-sm w-20 text-right">{(item?.voters / 1000000)?.toFixed(1)}M</span>
              </div>
            );
          })}
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-gray-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Total verified voters: {(TIER_DATA?.reduce((s, t) => s + t?.voters, 0) / 1000000)?.toFixed(1)}M</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemographicBreakdown;
