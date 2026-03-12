import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const ContentModerationBadge = ({ score, status }) => {
  if (!score && !status) return null;

  const getConfig = () => {
    if (status === 'flagged' || score > 0.85) {
      return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Flagged' };
    }
    if (score > 0.5) {
      return { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Review' };
    }
    return { icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Safe' };
  };

  const config = getConfig();
  const Icon = config?.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config?.bg} ${config?.color}`}>
      <Icon className="w-3 h-3" />
      {config?.label}
    </span>
  );
};

export default ContentModerationBadge;
