import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const AnswerDistributionPanel = ({ questions = [], loading = false }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const currentQuestion = questions?.[selectedQuestion];
  const distributionData = currentQuestion?.optionDistribution?.map((item, i) => ({
    option: `Option ${String.fromCharCode(65 + i)}`,
    count: item?.count || 0,
    percentage: item?.percentage || 0,
    text: item?.text || `Option ${i + 1}`,
    isCorrect: item?.isCorrect || false
  })) || [];

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-48 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <BarChart2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Answer Distribution</h3>
          <p className="text-gray-400 text-sm">Option selection frequency per question</p>
        </div>
      </div>

      {questions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
          <p>No distribution data available</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedQuestion(Math.max(0, selectedQuestion - 1))}
              disabled={selectedQuestion === 0}
              className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center flex-1 mx-4">
              <p className="text-white text-sm font-medium line-clamp-2">{currentQuestion?.questionText || `Question ${selectedQuestion + 1}`}</p>
              <p className="text-gray-400 text-xs mt-1">{selectedQuestion + 1} of {questions?.length}</p>
            </div>
            <button
              onClick={() => setSelectedQuestion(Math.min(questions?.length - 1, selectedQuestion + 1))}
              disabled={selectedQuestion === questions?.length - 1}
              className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="option" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  formatter={(value, name, props) => [`${value} votes (${props?.payload?.percentage}%)`, props?.payload?.text]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}
                  fill="#8b5cf6"
                  label={{ position: 'top', fill: '#9ca3af', fontSize: 11, formatter: (v) => `${v}` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {distributionData?.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${item?.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-700/50'}`}>
                <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${item?.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-300 text-xs flex-1 truncate">{item?.text}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-600 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-purple-400" style={{ width: `${item?.percentage}%` }}></div>
                  </div>
                  <span className="text-white text-xs font-medium w-10 text-right">{item?.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnswerDistributionPanel;
