import React from 'react';
import { Helmet } from 'react-helmet';
import { AppShell } from './AppShell';
import { PageContainer } from './PageContainer';
import HeaderNavigation from '../ui/HeaderNavigation';
import LeftSidebar from '../ui/LeftSidebar';
import { useBreakpoints } from '../../hooks/useBreakpoints';

/**
 * GeneralPageLayout: A unified layout component for all citizen-facing pages.
 * Integrates HeaderNavigation, LeftSidebar (desktop), and a responsive main content area.
 */
const GeneralPageLayout = ({ 
  children, 
  title,
  description,
  showSidebar = true, 
  maxWidth = 'max-w-[1440px]',
  className = ''
}) => {
  const { isDesktop } = useBreakpoints();

  return (
    <>
      {title && (
        <Helmet>
          <title>{title} | Vottery</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}
      <AppShell className="relative">
        {/* Premium Aurora Background Blobs - Standardized */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow-reverse opacity-50"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px] animate-float opacity-30"></div>
        </div>

        <HeaderNavigation />
        
        {/* Main Layout Grid */}
        <div className={`min-h-screen pt-20 lg:pt-24 ${showSidebar && isDesktop ? 'lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]' : ''} relative z-10 px-4 lg:px-8`}>
          
          {/* Left Sidebar Column (Fixed) */}
          {showSidebar && (
            <div className="hidden lg:block relative">
              <LeftSidebar />
            </div>
          )}

          {/* Main Content Area */}
          <main id="main-content" className="min-w-0 flex flex-col items-center w-full">
            <PageContainer maxWidth={maxWidth} className={`py-0 ${className}`} withBottomNavPadding={true}>
              {children}
            </PageContainer>
          </main>
        </div>
      </AppShell>
    </>
  );
};

export default GeneralPageLayout;
