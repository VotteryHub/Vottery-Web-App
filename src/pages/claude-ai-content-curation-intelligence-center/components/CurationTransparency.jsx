import React from 'react';
import { Eye } from 'lucide-react';

const CurationTransparency = ({ curationData }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Curation Transparency Tools</h2>
      </div>
      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">AI Decision-Making Process</h3>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• Analyzed user behavior patterns and engagement history</li>
          <li>• Applied contextual reasoning to match content with user interests</li>
          <li>• Calculated viral probability based on social proof indicators</li>
          <li>• Optimized content placement within 3D carousels for maximum engagement</li>
          <li>• Continuously learning from user interactions to improve recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default CurationTransparency;