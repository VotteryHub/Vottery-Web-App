import React, { useState } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import ColorTokens from './components/ColorTokens';
import ButtonStyles from './components/ButtonStyles';
import CardDesigns from './components/CardDesigns';
import TypographySystem from './components/TypographySystem';
import SpacingScale from './components/SpacingScale';
import Icon from '../../components/AppIcon';

const DesignSystemFoundation = () => {
  const [activeSection, setActiveSection] = useState('colors');

  const sections = [
    { id: 'colors', label: 'Color Tokens', icon: 'Palette' },
    { id: 'buttons', label: 'Button Styles', icon: 'MousePointer' },
    { id: 'cards', label: 'Card Designs', icon: 'Square' },
    { id: 'typography', label: 'Typography', icon: 'Type' },
    { id: 'spacing', label: 'Spacing Scale', icon: 'Maximize2' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 ml-0 lg:ml-64 mt-16">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Design System Foundation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Unified visual language and component standards for the Vottery platform
              </p>
            </div>

            {/* Navigation */}
            <div className="card mb-6">
              <div className="p-2">
                <div className="flex gap-2 overflow-x-auto">
                  {sections?.map((section) => (
                    <button
                      key={section?.id}
                      onClick={() => setActiveSection(section?.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        activeSection === section?.id
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon name={section?.icon} size={20} />
                      <span>{section?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              {activeSection === 'colors' && <ColorTokens />}
              {activeSection === 'buttons' && <ButtonStyles />}
              {activeSection === 'cards' && <CardDesigns />}
              {activeSection === 'typography' && <TypographySystem />}
              {activeSection === 'spacing' && <SpacingScale />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DesignSystemFoundation;