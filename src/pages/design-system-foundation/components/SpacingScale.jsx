import React from 'react';

const SpacingScale = () => {
  const spacingValues = [
    { name: '0', value: '0px', class: 'p-0' },
    { name: '1', value: '0.25rem / 4px', class: 'p-1' },
    { name: '2', value: '0.5rem / 8px', class: 'p-2' },
    { name: '3', value: '0.75rem / 12px', class: 'p-3' },
    { name: '4', value: '1rem / 16px', class: 'p-4' },
    { name: '5', value: '1.25rem / 20px', class: 'p-5' },
    { name: '6', value: '1.5rem / 24px', class: 'p-6' },
    { name: '8', value: '2rem / 32px', class: 'p-8' },
    { name: '10', value: '2.5rem / 40px', class: 'p-10' },
    { name: '12', value: '3rem / 48px', class: 'p-12' },
    { name: '16', value: '4rem / 64px', class: 'p-16' }
  ];

  const borderRadius = [
    { name: 'Small', value: '6px', class: 'rounded-sm', var: '--radius-sm' },
    { name: 'Medium', value: '12px', class: 'rounded-md', var: '--radius-md' },
    { name: 'Large', value: '18px', class: 'rounded-lg', var: '--radius-lg' },
    { name: 'Extra Large', value: '24px', class: 'rounded-xl', var: '--radius-xl' },
    { name: 'Full', value: '9999px', class: 'rounded-full', var: 'N/A' }
  ];

  return (
    <div className="space-y-8">
      {/* Spacing Scale */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Spacing Scale
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Consistent spacing system based on 4px base unit
        </p>
        <div className="space-y-4">
          {spacingValues?.map((spacing) => (
            <div key={spacing?.name} className="flex items-center gap-4">
              <div className="w-20 text-right">
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {spacing?.name}
                </span>
              </div>
              <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <div className="bg-primary" style={{ width: spacing?.value?.split(' / ')?.[1] || spacing?.value, height: '24px' }}></div>
              </div>
              <div className="w-48">
                <p className="text-sm text-gray-900 dark:text-gray-100">{spacing?.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{spacing?.class}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Border Radius */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Border Radius Scale
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Consistent corner radius values for cards, buttons, and containers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borderRadius?.map((radius) => (
            <div key={radius?.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className={`w-full h-24 bg-primary mb-4 ${radius?.class}`}></div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {radius?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{radius?.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{radius?.class}</p>
              {radius?.var !== 'N/A' && (
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-1">{radius?.var}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Usage Examples */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Spacing Usage Examples
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Common spacing patterns in UI components
        </p>
        <div className="space-y-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Card Padding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-2 border-dashed border-primary rounded-lg">
                <div className="p-4 bg-primary/10">
                  <p className="text-sm text-gray-900 dark:text-gray-100">p-4 (16px)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Standard card padding</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-primary rounded-lg">
                <div className="p-6 bg-primary/10">
                  <p className="text-sm text-gray-900 dark:text-gray-100">p-6 (24px)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Comfortable card padding</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-primary rounded-lg">
                <div className="p-8 bg-primary/10">
                  <p className="text-sm text-gray-900 dark:text-gray-100">p-8 (32px)</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Spacious card padding</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Element Gaps</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">gap-2 (8px) - Tight spacing</p>
                <div className="flex gap-2">
                  <div className="w-16 h-16 bg-primary rounded"></div>
                  <div className="w-16 h-16 bg-primary rounded"></div>
                  <div className="w-16 h-16 bg-primary rounded"></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">gap-4 (16px) - Standard spacing</p>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary rounded"></div>
                  <div className="w-16 h-16 bg-secondary rounded"></div>
                  <div className="w-16 h-16 bg-secondary rounded"></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">gap-6 (24px) - Comfortable spacing</p>
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-accent rounded"></div>
                  <div className="w-16 h-16 bg-accent rounded"></div>
                  <div className="w-16 h-16 bg-accent rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacingScale;