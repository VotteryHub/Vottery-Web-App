import React, { useState } from 'react';
import { hasAnyRole } from '../constants/roles';
import { useAuth } from '../contexts/AuthContext';
import UpgradeToRoleModal from './UpgradeToRoleModal';

/**
 * Wraps a link/button. If user lacks required role, shows upgrade modal instead of navigating.
 * Use for: Create Election (creator), Ads Studio (advertiser).
 */
export default function UpgradePromptLink({
  children,
  to,
  requiredRole,
  className = '',
  asButton = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || 'voter';

  const checkAndNavigate = (e) => {
    if (asButton && children?.props?.onClick) return;
    if (!requiredRole) return;
    if (!hasAnyRole(userRole, [requiredRole])) {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setShowModal(true);
    }
  };

  const config = {
    creator: { targetRole: 'creator', targetPath: '/election-creation-studio' },
    advertiser: { targetRole: 'advertiser', targetPath: '/participatory-ads-studio' },
  };
  const c = config[requiredRole] || config.creator;

  if (asButton) {
    return (
      <>
        <div onClick={checkAndNavigate} className={className}>
          {children}
        </div>
        <UpgradeToRoleModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          targetRole={c.targetRole}
          targetPath={c.targetPath}
        />
      </>
    );
  }

  return (
    <>
      <span onClick={checkAndNavigate} className={className}>
        {children}
      </span>
      <UpgradeToRoleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        targetRole={c.targetRole}
        targetPath={c.targetPath}
      />
    </>
  );
}
