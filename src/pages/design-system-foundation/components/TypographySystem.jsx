import React from 'react';

const TypographySystem = () => {
  return (
    <div className="space-y-8">
      {/* Heading Hierarchy */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Heading Hierarchy
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Consistent heading styles using Outfit font family
        </p>
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1 className="text-h1 mb-2">Heading 1 - Main Page Titles</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              2.5rem / 40px · font-weight: 700 · line-height: 1.2
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-h2 mb-2">Heading 2 - Section Headers</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              2rem / 32px · font-weight: 600 · line-height: 1.25
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-h3 mb-2">Heading 3 - Subsection Titles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              1.5rem / 24px · font-weight: 600 · line-height: 1.3
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h4 className="text-h4 mb-2">Heading 4 - Card Titles</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              1.25rem / 20px · font-weight: 500 · line-height: 1.4
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h5 className="text-h5 mb-2">Heading 5 - Small Headings</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              1.125rem / 18px · font-weight: 500 · line-height: 1.5
            </p>
          </div>
        </div>
      </div>

      {/* Body Text */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Body Text Styles
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Primary content text using Source Sans 3 font family
        </p>
        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-lg mb-2">
              Large body text for emphasis and introductions. This size is perfect for lead paragraphs and important content.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              1.125rem / 18px · font-weight: 400 · line-height: 1.6
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-base mb-2">
              Default body text for standard content. This is the most commonly used text size across the platform for paragraphs, descriptions, and general content.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              1rem / 16px · font-weight: 400 · line-height: 1.6
            </p>
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-sm mb-2">
              Small body text for secondary information, captions, and metadata. Used for timestamps, labels, and supporting details.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              0.875rem / 14px · font-weight: 400 · line-height: 1.5
            </p>
          </div>
          <div className="pb-4">
            <p className="text-xs mb-2">
              Extra small text for fine print, legal text, and minimal UI elements.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              0.75rem / 12px · font-weight: 400 · line-height: 1.4
            </p>
          </div>
        </div>
      </div>

      {/* Font Families */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Font Families
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Four specialized font families for different content types
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Outfit - Headings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Modern, geometric sans-serif for titles and headings
            </p>
            <p className="font-heading text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-heading text-lg">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-heading text-lg">0123456789</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-body text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Source Sans 3 - Body
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Highly readable sans-serif for body text and content
            </p>
            <p className="font-body text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-body text-lg">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-body text-lg">0123456789</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-caption text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Inter Tight - Captions
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Compact sans-serif for UI labels and captions
            </p>
            <p className="font-caption text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-caption text-lg">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-caption text-lg">0123456789</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-data text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              JetBrains Mono - Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Monospace font for numbers, code, and data display
            </p>
            <p className="font-data text-lg">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            <p className="font-data text-lg">abcdefghijklmnopqrstuvwxyz</p>
            <p className="font-data text-lg">0123456789</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographySystem;