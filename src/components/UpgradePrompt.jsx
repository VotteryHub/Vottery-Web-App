import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';
import { hasAnyRole } from '../constants/roles';

/**
 * Shows "Upgrade to Creator" or "Upgrade to Advertiser" CTA when user lacks the role.
 * Use on pages/buttons that require creator or advertiser access.
 */
export default function UpgradePrompt({ requiredRole = 'creator', className = '', compact = false }) {
  const info = {
    creator: {
      label: 'Creator',
      icon: 'PlusCircle',
      path: '/role-upgrade?role=creator',
      description: 'Create elections and monetize your audience.',
    },
    advertiser: {
      label: 'Advertiser',
      icon: 'Megaphone',
      path: '/role-upgrade?role=advertiser',
      description: 'Run participatory ad campaigns and track ROI.',
    },
  }[requiredRole] || info.creator;

  return (
    <Link
      to={info.path}
      className={`block rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon name={info.icon} size={22} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Upgrade to {info.label}
          </p>
          {!compact && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {info.description}
            </p>
          )}
          <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary">
            Get started <Icon name="ArrowRight" size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Renders UpgradePrompt only if user lacks the required role.
 */
export function UpgradePromptIfNeeded({ userRole, requiredRole, ...props }) {
  if (hasAnyRole(userRole, [requiredRole])) return null;
  return <UpgradePrompt requiredRole={requiredRole} {...props} />;
}
