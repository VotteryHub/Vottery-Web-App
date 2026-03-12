import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { hasAnyRole } from '../../constants/roles';
import UpgradePromptLink from '../UpgradePromptLink';

const ElectionsSidebar = () => {
  const location = useLocation();
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || 'voter';
  const canCreate = hasAnyRole(userRole, ['creator', 'admin']);
  const [expandedSections, setExpandedSections] = useState({
    myElections: true,
    participation: true,
    verification: false,
  });

  const isActive = (path) => location?.pathname === path;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev?.[section],
    }));
  };

  const createElectionItem = canCreate
    ? { label: 'Create Election', path: '/election-creation-studio', icon: 'PlusCircle', requiresCreator: false }
    : { label: 'Create Election', path: '/election-creation-studio', icon: 'PlusCircle', requiresCreator: true };

  const sidebarSections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      path: '/elections-dashboard',
    },
    {
      id: 'myElections',
      label: 'My Elections',
      icon: 'FolderOpen',
      expandable: true,
      items: [
        { label: 'Created', path: '/elections-dashboard?tab=created', icon: 'Plus' },
        { label: 'Participating', path: '/elections-dashboard?tab=participating', icon: 'Users' },
        { label: 'Completed', path: '/elections-dashboard?tab=completed', icon: 'CheckCircle' },
      ],
    },
    {
      id: 'participation',
      label: 'Participation',
      icon: 'Vote',
      expandable: true,
      items: [
        createElectionItem,
        { label: 'Vote Now', path: '/secure-voting-interface', icon: 'Vote' },
        { label: 'Active Elections', path: '/elections-dashboard?filter=active', icon: 'Activity' },
      ],
    },
    {
      id: 'verification',
      label: 'Verification & Audit',
      icon: 'ShieldCheck',
      expandable: true,
      items: [
        { label: 'Verify Vote', path: '/vote-verification-portal', icon: 'ShieldCheck' },
        { label: 'Blockchain Audit', path: '/blockchain-audit-portal', icon: 'FileSearch' },
        { label: 'Transaction History', path: '/blockchain-audit-portal?tab=history', icon: 'History' },
      ],
    },
  ];

  return (
    <aside className="elections-sidebar">
      <div className="space-y-1">
        {sidebarSections?.map((section) => (
          <div key={section?.id}>
            {section?.expandable ? (
              <>
                <button
                  onClick={() => toggleSection(section?.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-all duration-250"
                >
                  <span className="flex items-center gap-2">
                    <Icon name={section?.icon} size={22} strokeWidth={2.5} />
                    {section?.label}
                  </span>
                  <Icon
                    name="ChevronDown"
                    size={20}
                    strokeWidth={2.5}
                    className={`transition-transform duration-250 ${
                      expandedSections?.[section?.id] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedSections?.[section?.id] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section?.items?.map((item) =>
                      item?.requiresCreator ? (
                        <UpgradePromptLink key={item?.path} requiredRole="creator" className="block">
                          <span
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted`}
                          >
                            <Icon name={item?.icon} size={20} strokeWidth={2.5} />
                            {item?.label}
                            <span className="text-xs text-primary ml-1">Upgrade</span>
                          </span>
                        </UpgradePromptLink>
                      ) : (
                        <Link
                          key={item?.path}
                          to={item?.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                            isActive(item?.path) || location?.search?.includes(item?.path?.split('?')?.[1])
                              ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon name={item?.icon} size={20} strokeWidth={2.5} />
                          {item?.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={section?.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                  isActive(section?.path)
                    ? 'text-primary bg-primary/10' :'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={section?.icon} size={22} strokeWidth={2.5} />
                {section?.label}
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="px-3 py-2 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Icon name="TrendingUp" size={18} strokeWidth={2.5} />
            <span>Your Activity</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Elections Created</span>
              <span className="font-data font-medium text-foreground">12</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Votes Cast</span>
              <span className="font-data font-medium text-foreground">47</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Verifications</span>
              <span className="font-data font-medium text-foreground">23</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 px-3">
        <div className="crypto-indicator">
          <Icon name="Lock" size={18} strokeWidth={2.5} />
          <span className="text-xs font-medium">Blockchain Connected</span>
        </div>
      </div>
    </aside>
  );
};

export default ElectionsSidebar;