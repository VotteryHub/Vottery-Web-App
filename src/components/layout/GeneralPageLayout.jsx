import React from 'react';
import { Helmet } from 'react-helmet';
import { AppShell } from './AppShell';
import HeaderNavigation from '../ui/HeaderNavigation';
import LeftSidebar from '../ui/LeftSidebar';
import RightColumnSidebar from '../ui/RightColumnSidebar';

/**
 * GeneralPageLayout — Facebook-style 3-column layout.
 *
 * Columns:
 *  - Left  : LeftSidebar (fixed, 280px) — always shown on lg+
 *  - Center: main content (max-w-[600px] on feed, wider on other pages)
 *  - Right : RightColumnSidebar (360px sticky) — only when showRightColumn=true
 *
 * Props:
 *  children        — center column content
 *  title           — <title> tag
 *  description     — meta description
 *  showRightColumn — boolean, shows right sticky sidebar (home feed only)
 *  centerMaxWidth  — tailwind max-w class for center column (default: max-w-[680px])
 *  className       — extra classes on center wrapper
 */
const GeneralPageLayout = ({
  children,
  title,
  description,
  showRightColumn = false,
  centerMaxWidth = 'max-w-[680px]',
  className = '',
  leftSidebar = <LeftSidebar />,
}) => {
  return (
    <>
      {title && (
        <Helmet>
          <title>{title} | Vottery</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}

      <AppShell className="relative">
        {/* Subtle ambient background (dark mode only) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 dark:block hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[160px]" />
        </div>

        {/* ── Sticky Top Header ── */}
        <HeaderNavigation />

        {/* ── Page Body (below header, height = 100vh - header height 92px) ── */}
        {/* Header height: 48px (row1) + 44px (row2) = 92px total */}
        <div className="pt-[92px] min-h-screen relative z-10">
          <div className="max-w-[1920px] mx-auto flex justify-center">

            {/* ── Left Sidebar (fixed on lg+) ── */}
            {leftSidebar}

            {/* ── Center Column ── */}
            <main
              id="main-content"
              className={`
                flex-1 min-w-0
                lg:ml-[280px]
                ${showRightColumn ? 'xl:mr-[376px]' : ''}
                flex flex-col items-center
                px-0 lg:px-4
              `}
            >
              <div className={`w-full ${showRightColumn ? 'max-w-[680px]' : centerMaxWidth} py-4 ${className}`}>
                {children}
              </div>
            </main>

            {/* ── Right Column (home feed only) ── */}
            {showRightColumn && (
              <div className="hidden xl:block fixed right-0 top-[92px] h-[calc(100vh-92px)] w-[376px] overflow-y-auto px-4 py-4 scrollbar-none">
                <RightColumnSidebar />
              </div>
            )}

          </div>
        </div>
      </AppShell>
    </>
  );
};

export default GeneralPageLayout;
