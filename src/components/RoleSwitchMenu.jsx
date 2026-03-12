import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { useAuth } from '../contexts/AuthContext';
import { hasAnyRole } from '../constants/roles';

/**
 * Role switching UI for users with multiple roles.
 * Renders "Switch to Creator" / "Switch to Advertiser" when user has that role.
 * Renders "Upgrade to Creator" / "Upgrade to Advertiser" when user lacks the role.
 */
export default function RoleSwitchMenu({ onClose, className = '' }) {
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || 'voter';

  const isCreator = hasAnyRole(userRole, ['creator']);
  const isAdvertiser = hasAnyRole(userRole, ['advertiser']);

  const items = [];

  if (!isCreator) {
    items.push({
      id: 'upgrade-creator',
      label: 'Upgrade to Creator',
      description: 'Create elections and monetize',
      path: '/role-upgrade?role=creator',
      icon: 'PlusCircle',
      isUpgrade: true,
    });
  } else {
    items.push({
      id: 'switch-creator',
      label: 'Creator view',
      description: 'Create elections, analytics',
      path: '/election-creation-studio',
      icon: 'PlusCircle',
      isUpgrade: false,
    });
  }

  if (!isAdvertiser) {
    items.push({
      id: 'upgrade-advertiser',
      label: 'Upgrade to Advertiser',
      description: 'Run campaigns and ads',
      path: '/role-upgrade?role=advertiser',
      icon: 'Megaphone',
      isUpgrade: true,
    });
  } else {
    items.push({
      id: 'switch-advertiser',
      label: 'Advertiser view',
      description: 'Campaigns, ROI dashboards',
      path: '/participatory-ads-studio',
      icon: 'Megaphone',
      isUpgrade: false,
    });
  }

  return (
    <div className={`py-2 ${className}`}>
      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Switch or upgrade
      </div>
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all rounded-lg ${
            item.isUpgrade ? 'border border-dashed border-primary/50' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Icon name={item.icon} size={18} className="text-gray-700 dark:text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
          </div>
          {item.isUpgrade && (
            <span className="text-xs font-medium text-primary">Upgrade</span>
          )}
        </Link>
      ))}
    </div>
  );
}
