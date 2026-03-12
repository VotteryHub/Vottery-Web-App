import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';

/**
 * Modal shown when a voter tries to access creator/advertiser features.
 * Prompts upgrade with CTA to the target page (which may require role change via admin).
 */
export default function UpgradeToRoleModal({ isOpen, onClose, targetRole, targetPath, targetLabel }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const config = {
    creator: {
      title: 'Upgrade to Creator',
      description: 'Create elections, build your audience, and monetize your content. Request creator access to get started.',
      icon: 'PlusCircle',
      cta: 'Request Creator Access',
      path: '/role-upgrade?role=creator',
    },
    advertiser: {
      title: 'Upgrade to Advertiser',
      description: 'Run participatory ad campaigns, reach engaged audiences, and track ROI. Request advertiser access to get started.',
      icon: 'Megaphone',
      cta: 'Request Advertiser Access',
      path: '/role-upgrade?role=advertiser',
    },
  };

  const c = config[targetRole] || config.creator;
  const path = targetPath || c.path;

  const handleUpgrade = () => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name={c.icon} size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{c.title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{c.description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            {c.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
