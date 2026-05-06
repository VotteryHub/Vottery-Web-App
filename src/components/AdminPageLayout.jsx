/**
 * AdminPageLayout — K7 Kernel shared layout for all admin pages.
 * Wraps HeaderNavigation + AdminToolbar + a consistent max-width container.
 * Protected by requireAdmin prop — if user is not admin, redirects to /403.
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import HeaderNavigation from './ui/HeaderNavigation';
import AdminToolbar from './ui/AdminToolbar';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';

const AdminPageLayout = ({
  title,
  description,
  icon = 'Shield',
  iconColor = 'var(--color-destructive)',
  children,
}) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const role = userProfile?.role;
  if (role && role !== 'admin' && role !== 'moderator') {
    return <Navigate to="/403" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{title} — Vottery Admin</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <AdminToolbar />
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6 md:mb-8 flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${iconColor}18` }}
            >
              <Icon name={icon} size={24} color={iconColor} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminPageLayout;
